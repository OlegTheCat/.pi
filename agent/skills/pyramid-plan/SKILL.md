---
name: pyramid-plan
description: Build a code-grounded plan progressively through intent, approach, and technical layers. Pause for user feedback after each layer; do not implement without explicit approval.
---

# Pyramid Plan

Build a code-grounded plan one layer at a time, refining it with the user before going deeper. Don't implement without explicit approval.

## Pyramid Plan File Info

Use the user's chosen file or `pi-plan-<task-slug>.md` in the project root. Share its absolute path before writing, and update the same file as the plan evolves.

## Pyramid Layers

- **Intent:** What outcome do we want, what stays unchanged, and what's out of scope? Keep it to a short paragraph.
- **Approach:** How should we achieve it, and what important choices or trade-offs are involved? Aim for up to 3 medium paragraphs and/or 3-6 bullet points, expand only if the task's scope requires it. Keep an additional newline between paragraphs/bullet points for better readability.
- **Technical:** What exactly changes, in which files, and how do we verify it? Include relevant edge cases and tests.

Each layer adds detail rather than repeating the layers above. Keep the plan digestible; it is not a transcript of your research.

## Procedure for Each Layer

1. **Investigate:** Understand the user's intent and read enough code to ground the current layer. Follow relevant paths and existing patterns; defer lower-level research until needed.
2. **Clarify:** Ask about consequential unknowns at this depth. Don't ask what the code already answers or manufacture questions; defer lower-level choices.
3. **Design:** Work out the current layer, not the entire implementation. Recommend one approach and surface only choices that matter.
4. **Write:** Add or refine this layer in the shared plan file, preserving agreed decisions above it.
5. **Review:** Check against the code, the user's request, and agreed upper layers. Remove repetition, needless detail, and work outside the scope.
6. **Pause:** Share the plan path and current layer, then wait for feedback. Do not automatically expand the next layer.

These are working checkpoints, not required output sections. Skip clarification when nothing needs asking.

## Progression Rules

- Start at intent unless the conversation already establishes it.
- Feedback revises the current layer; agreement advances to the next six-phase pass.
- Expand details where useful, not every branch equally. Each pass produces only the current layer, not the entire pyramid.
- If deeper investigation challenges an agreed decision, explain why and revisit it explicitly.
- Explicit approval to implement exits planning at any layer; reaching the technical layer is not required. Agreement on a planning layer alone is not implementation approval.
