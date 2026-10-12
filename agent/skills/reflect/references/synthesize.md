# Synthesize findings

Turn the judgment and tooling candidates into one filtered set of proposals. Work from the reflection file; don't review the conversation again.

## 1. Merge

Combine candidates that describe the same lesson. Keep the strongest evidence and one destination.

## 2. Filter

Accept a candidate only if it passes every check:

- **Durable:** still true in six months, after paths, versions, and code have changed.
- **Changes behavior:** a future agent would do something differently, not just read more text.
- **Verified:** the evidence shows what happened. A lesson resting on an unchecked claim goes to Needs verification.
- **Right size:** specific enough to recognize when it applies, general enough to reuse.
- **Not already covered:** read the target skill. Reject duplicates of clear guidance. If the guidance exists but is easy to miss, propose rewording or moving it instead.
- **Best destination:** if a script, check, or config would enforce it more reliably than prose, route it there.

For explicit-only skills, a missed invocation isn't a reason to change the description; the user decides when to call them.

## 3. Record the result

Add a `Synthesis` section to the reflection file with three groups:

- **Accepted:** grouped by destination. For each, give the problem, the proposed change, and the exact target (skill and section, memory scope, or fix location).
- **Rejected:** one line each, with the lesson and the failed check.
- **Needs verification:** the lesson and what evidence is missing.

Empty groups are fine. Don't edit skills, save memories, or implement fixes just yet. 
