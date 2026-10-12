---
name: reflect
description: Review the active pi conversation for durable lessons and propose improvements to existing skills. Use when the user explicitly asks to reflect on a session. Saves memory findings; proposes skill and tooling changes for approval.
disable-model-invocation: true
---

# Reflect

Reflect, don't implement. You may save accepted memory findings yourself. Skill changes, new skills, and tooling fixes need explicit approval.

## Principles

Prefer durable, decision-changing lessons over one-off facts. Improve existing skills rather than multiplying instructions. No findings is a valid result.

## History Scope

Figure out the history scope you'll be working with:

- Default: work with the conversation you can currently see. After compaction, this includes the summary and retained messages, not the original older messages.
- Full history: only when the user asks for it, for example `/skill:reflect full history`.

## Reflection File

If the user designated a reflection file, use it. Otherwise, designate an absolute path in a durable location — prefer a project-local reflect directory (e.g. `<project>/cases/reflect/pi-reflect-<descriptive-session-slug>.md`) or a user-level directory; avoid ephemeral paths like /tmp so findings survive restarts — and tell the user that path before writing. Build the findings incrementally in that file.

## Workflow

If todo-list tools are available, use them to track the applicable stages. Mark stages done as you go.

Load only the reference for the current stage when you start it. Don't read all stage references up front.

1. **Only when the user asked for full history**, locate the active transcript — [references/locate-transcript.md](references/locate-transcript.md). Otherwise, start at stage 2.
2. Review judgment — [references/judgment-review.md](references/judgment-review.md).
3. Review tooling and avoidable manual effort — [references/tooling-review.md](references/tooling-review.md).
4. Synthesize findings and check acceptance criteria — [references/synthesize.md](references/synthesize.md).
5. Save memories and present proposals — [references/remember-and-present.md](references/remember-and-present.md).
6. Stop. Wait for the user to approve specific proposals.

