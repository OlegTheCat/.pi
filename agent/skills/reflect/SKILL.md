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

With no arguments, work with the conversation you can currently see — the compaction summary and retained messages, not the original older messages.

Otherwise the argument is `<from>`: a free-form description of the starting point.

## Reflection File

If the user designated a reflection file, use it. Otherwise, designate an absolute path `/tmp/pi-reflect-<descriptive-session-slug>.md` and tell the user that path before writing. Build the findings incrementally in that file.

## Workflow

If todo-list tools are available, use them to track the applicable stages. Mark stages done as you go.

Load only the reference for the current stage when you start it. Don't read all stage references up front.

1. **When the user passed any arguments**, resolve the scope — [references/resolve-scope.md](references/resolve-scope.md). Otherwise, start at stage 2.
2. Review judgment — [references/judgment-review.md](references/judgment-review.md).
3. Review tooling and avoidable manual effort — [references/tooling-review.md](references/tooling-review.md).
4. Synthesize findings and check acceptance criteria — [references/synthesize.md](references/synthesize.md).
5. Save memories and present proposals — [references/remember-and-present.md](references/remember-and-present.md).
6. Stop. Wait for the user to approve specific proposals.

