---
name: plan
description: Create a well-researched implementation plan without executing it or using subagents. Use when the user requests planning mode, a plan before coding, or an implementation proposal for a feature, bug fix, or refactor. Investigate code, clarify requirements, design an approach, write and review a plan, then wait for explicit approval.
---

# Plan

Plan, don't implement. Follow repository guidance; wait for explicit approval before coding.

## Plan File Info

If the user designated a plan file, use it. Otherwise, use `pi-plan-<descriptive-task-slug>.md` in the root of the current project or repository. Resolve it to an absolute path and tell the user that path before writing. Reuse the same file when refining this plan.

You should build your plan incrementally by writing to or editing this file.

**Plan File Guidelines:** The plan file should contain only your final recommended approach, not all alternatives considered. Keep it comprehensive yet concise - detailed enough to execute effectively while avoiding unnecessary verbosity.

## Plan Workflow

If todo-list tools are available, use them to track these six stages. Create all todo items for each stage upfront, and mark stages done as you go.

Scale the depth to the task. Keep all six phases, but use a brief pass for a truly trivial task (typo fixes, single-line changes, simple renames). Do not manufacture questions, alternatives, or architectural work just to fill the workflow.

### Phase 1: Investigate

Goal: Understand what the user wants and how the code works today.

1. Read the repository instructions, relevant code, and tests. Look for existing patterns you can reuse.
2. Follow how the affected parts work together. Read enough to understand the change, without exploring unrelated code.
3. Note what needs to change, which files matter, and any constraints. Separate what you've confirmed from assumptions and open questions.

### Phase 2: Clarify

Goal: Clear up important questions before deciding how to make the change.

After reading the code, use the question tool to ask about anything important that's still unclear.

- Don't ask what the code or instructions already answer.
- Ask when the answer would change what you build, how it behaves, whether existing users are affected, or how you build it.
- Don't guess what the user wants. If an important answer is missing, wait rather than decide for them.
- If the request is clear, move on without extra questions.

### Phase 3: Design

Goal: Decide how to make the change.

Use what the user wants and what you learned from the code: the files involved, how they work together, and any requirements or limits.

Consider other approaches when the choice matters:
- New feature: weigh simplicity, speed, and ease of maintenance.
- Bug fix: weigh fixing the cause, using a workaround, and preventing recurrence.
- Refactoring: weigh a small change against a cleaner structure.

Recommend one approach and briefly explain why. Prefer existing patterns and keep the change as small as practical. Work out what to do first, what depends on what, what could go wrong, and how to check that it works.

### Phase 4: Write

Goal: Write your final plan to the plan file.

- Include only your recommended approach, not all alternatives.
- Include the paths of critical files to be modified.
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests).

Use this structure, omitting sections that genuinely do not apply:

```markdown
# <Task title>

## Goal and scope
What should change, any limits, and what's out of scope.

## Recommended approach
How to make the change, how it fits the existing code, and why you recommend this approach.

## Implementation steps
What to change, in what order, in which files, and why.
Use exact file paths and mark new files as new.

## Risks and considerations
What could go wrong, what existing behavior could break, and how to avoid it.
Any assumptions or things blocking progress.

## Verification
Specific tests/checks and end-to-end scenarios with expected outcomes.
```

### Phase 5: Review

Goal: Make sure the plan is correct and does what the user asked.

1. Read the plan and check it against the code and the user's request.
2. Check that the plan covers everything the user asked for. Look for unusual cases, things that could break, errors to handle, needless complexity, and work outside the request.
3. Make sure the tests cover both what should work and what could go wrong.
4. Use the question tool if anything important is still unclear. If an answer changes the approach, rethink it and update the plan.
5. Fix the plan before asking for approval.

### Phase 6: Stop

Goal: Get approval before coding.

Share the plan path and a brief summary, ask for approval to implement, then stop. Refine the plan if requested; agreement on a detail isn't permission to start coding.


