/**
 * Publish active Pi state for external displays (e.g. the Emacs mode line).
 * One atomic, private JSON heartbeat per process; idle means no file.
 * Inspired by pi-monitor-heartbeat's sidecar design, with Pi 1.4 lifecycle
 * checks and rpiv-ask-user-question's actual blocked-on-human event.
 */
import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export default function piStatus(pi: ExtensionAPI): void {
	const directory = join(process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent"), "run-status");
	const file = join(directory, `${process.pid}.json`);
	const temporary = `${file}.tmp`;
	let context: ExtensionContext | undefined;
	let timer: ReturnType<typeof setInterval> | undefined;
	let waiting = 0;
	let published = false;

	function remove(): void {
		try {
			rmSync(file, { force: true });
			rmSync(temporary, { force: true });
			published = false;
		} catch {
			// Advisory status must never interrupt the agent. Stale files expire.
		}
	}

	function publish(): void {
		if (!context) return;
		try {
			// Unlike agent_end, isIdle stays false through automatic retries,
			// queued work, and compaction. A cancelled manual compaction also
			// returns to idle without requiring a successful compact event.
			const state = waiting > 0 ? "waiting" : context.isIdle() ? undefined : "running";
			if (!state) {
				if (published) remove();
				return;
			}
			mkdirSync(directory, { recursive: true, mode: 0o700 });
			writeFileSync(temporary, `${JSON.stringify({ version: 1, pid: process.pid, state, updatedAt: Date.now() })}\n`, { mode: 0o600 });
			renameSync(temporary, file);
			published = true;
		} catch {
			// Includes an invalidated context during reload/shutdown.
		}
	}

	function stop(): void {
		if (timer) clearInterval(timer);
		timer = undefined;
		context = undefined;
		waiting = 0;
		process.removeListener("exit", remove);
		remove();
	}

	pi.on("session_start", (_event, ctx) => {
		stop();
		context = ctx;
		process.once("exit", remove);
		publish();
		// Also observes transitions without an extension event (e.g. the end
		// of manual compaction). unref keeps noninteractive runs exit-safe.
		timer = setInterval(publish, 2000);
		timer.unref();
	});
	pi.on("session_shutdown", stop);

	pi.on("before_agent_start", publish);
	pi.on("agent_start", publish);
	pi.on("agent_end", publish);
	pi.on("agent_settled", publish);
	pi.on("session_before_compact", publish);
	pi.on("session_compact", publish);
	pi.on("session_compact_failed", publish);

	// Stable public event from @juicesharp/rpiv-ask-user-question 2.12.0.
	// Brackets the actual UI wait, including RPC and calls via codemode.
	// Count pairs so overlapping questionnaires cannot clear each other.
	pi.events.on("rpiv:ask-user:blocked", (payload: unknown) => {
		if (!context || !payload || typeof payload !== "object") return;
		const active = (payload as { active?: unknown }).active;
		if (typeof active !== "boolean") return;
		waiting = active ? waiting + 1 : Math.max(0, waiting - 1);
		publish();
	});
}
