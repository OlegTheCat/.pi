import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import piStatus from "./index.ts";

function fixture(t: TestContext) {
	const directory = mkdtempSync(join(tmpdir(), "pi-status-test-"));
	const previous = process.env.PI_CODING_AGENT_DIR;
	process.env.PI_CODING_AGENT_DIR = directory;
	const events = new EventEmitter();
	const hooks = new Map<string, (...args: any[]) => unknown>();
	let tick = () => {};
	let idle = true;
	let now = 1000;
	let cleared = 0;
	t.mock.method(Date, "now", () => now);
	t.mock.method(globalThis, "setInterval", (callback: () => void, ms: number) => {
		assert.equal(ms, 2000);
		tick = callback;
		return { unref() {} };
	});
	t.mock.method(globalThis, "clearInterval", () => { cleared++; });
	const pi = { events, on: (name: string, fn: (...args: any[]) => unknown) => { hooks.set(name, fn); } };
	const emit = (name: string) => hooks.get(name)?.({}, { isIdle: () => idle });
	piStatus(pi as unknown as ExtensionAPI);
	const file = join(directory, "run-status", `${process.pid}.json`);
	t.after(() => {
		emit("session_shutdown");
		if (previous === undefined) delete process.env.PI_CODING_AGENT_DIR;
		else process.env.PI_CODING_AGENT_DIR = previous;
		rmSync(directory, { recursive: true, force: true });
	});
	return {
		directory, file, events, emit,
		idle: (value: boolean) => { idle = value; },
		now: (value: number) => { now = value; },
		tick: () => tick(), cleared: () => cleared,
		read: () => JSON.parse(readFileSync(file, "utf8")),
	};
}

test("no resources until session_start; idle sessions have no file", (t) => {
	const f = fixture(t);
	assert.equal(existsSync(f.file), false);
	f.emit("session_start");
	f.tick();
	assert.equal(existsSync(f.file), false);
});

test("working stays running through tool use, agent_end, retries and queued work", (t) => {
	const f = fixture(t);
	f.emit("session_start");
	f.idle(false);
	f.emit("before_agent_start");
	assert.deepEqual(f.read(), { version: 1, pid: process.pid, state: "running", updatedAt: 1000 });
	assert.equal(statSync(f.file).mode & 0o777, 0o600);
	f.emit("agent_end");
	f.now(3000);
	f.tick();
	assert.equal(f.read().state, "running");
	assert.equal(f.read().updatedAt, 3000);
	f.idle(true);
	f.emit("agent_settled");
	assert.equal(existsSync(f.file), false);
});

test("actual question wait overrides running until answer, cancellation or failure", (t) => {
	const f = fixture(t);
	f.emit("session_start");
	f.idle(false);
	for (const outcome of ["answer", "cancel", "error"]) {
		f.events.emit("rpiv:ask-user:blocked", { active: true });
		assert.equal(f.read().state, "waiting", outcome);
		f.tick();
		assert.equal(f.read().state, "waiting");
		f.events.emit("rpiv:ask-user:blocked", { active: false });
		assert.equal(f.read().state, "running", outcome);
	}
});

test("overlapping questionnaires and malformed events cannot clear a pending wait", (t) => {
	const f = fixture(t);
	f.emit("session_start");
	f.idle(false);
	f.events.emit("rpiv:ask-user:blocked", { active: true });
	f.events.emit("rpiv:ask-user:blocked", { active: true });
	f.events.emit("rpiv:ask-user:blocked", { active: false });
	f.events.emit("rpiv:ask-user:blocked", { active: "false" });
	f.events.emit("rpiv:ask-user:blocked", null);
	assert.equal(f.read().state, "waiting");
	f.events.emit("rpiv:ask-user:blocked", { active: false });
	assert.equal(f.read().state, "running");
	f.events.emit("rpiv:ask-user:blocked", { active: false });
	assert.equal(f.read().state, "running");
});

test("manual compaction, including cancellation without success, counts as running", (t) => {
	const f = fixture(t);
	f.emit("session_start");
	f.idle(false);
	f.emit("session_before_compact");
	assert.equal(f.read().state, "running");
	// Success event fires before Pi clears its compacting flag.
	f.emit("session_compact");
	f.idle(true);
	f.tick();
	assert.equal(existsSync(f.file), false);
	f.idle(false);
	f.emit("session_before_compact");
	f.idle(true);
	f.emit("session_compact_failed");
	assert.equal(existsSync(f.file), false);
});

test("shutdown/reload clears files, pending questions, timers and exit listeners", (t) => {
	const f = fixture(t);
	const listeners = process.listenerCount("exit");
	f.emit("session_start");
	f.events.emit("rpiv:ask-user:blocked", { active: true });
	assert.equal(f.read().state, "waiting");
	f.emit("session_shutdown");
	assert.equal(existsSync(f.file), false);
	assert.equal(process.listenerCount("exit"), listeners);
	assert.equal(f.cleared(), 1);
	f.tick();
	f.events.emit("rpiv:ask-user:blocked", { active: true });
	assert.equal(existsSync(f.file), false);
	f.emit("session_start");
	f.tick();
	assert.equal(existsSync(f.file), false);
});

test("filesystem failures are fail-open", (t) => {
	const f = fixture(t);
	writeFileSync(join(f.directory, "run-status"), "not a directory");
	assert.doesNotThrow(() => {
		f.emit("session_start");
		f.idle(false);
		f.emit("agent_start");
		f.tick();
		f.emit("session_shutdown");
	});
});
