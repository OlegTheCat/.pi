---
name: split-impl-tests
description: Rework branch commits into implementation first, tests second, then force-push safely. Use when asked to regroup or split implementation and tests into two commits.
---

# Split implementation and tests

- Identify the branch, target base, and push destination. Require clean tracked files; leave unrelated untracked files untouched.
- Save recovery refs for the original HEAD and the independently verified remote branch tip (full OIDs may differ). Record the original tree OID.
- Regroup the branch diff into exactly two commits: implementation first, tests second. Include fixes/cleanup in the appropriate commit; stage explicit paths, never `git add .`. Ask only if classification is ambiguous.
- Keep hooks enabled. Verify commit contents and that the final tree OID exactly matches the original. Stop on any unexpected change; don't rebase/update the base unless requested.
- Push with `--force-with-lease=refs/heads/<branch>:<captured-remote-OID>`. Never use unconditional force or refresh the expected OID to bypass rejection.
- Verify the remote tip matches HEAD. Report both commits and push result. Existing tests remain applicable to an identical tree; don't claim a fresh test run.
