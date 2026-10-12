# Review tooling

Look for technical knowledge a future agent would otherwise have to rediscover.

## 1. Find useful lessons

Review the conversation for:

- Commands, flags, or settings that took trial and error to get right.
- Tool, library, or package-manager quirks that caused a failure or surprise.
- Test, build, and debugging recipes: how to reproduce a problem, where logs are, how to verify a fix.
- Path or config conventions that aren't obvious from the code.
- Avoidable manual effort: did the user have to supply context that an available tool or skill could have fetched? A user sharing a link isn't a failure; flag it only when the agent asked for something it could have looked up.

State the lesson as a convention a future agent can recognize and reuse. Leave out details that drift: versions, commit hashes, exact counts, one-time paths.

## 2. Ground each candidate

For each candidate, capture:

- **Lesson:** the convention or technical fact and when it applies.
- **Evidence:** the command, error, or exchange that surfaced it. Identify the exchange clearly.
- **Proposal:** what a future agent should do differently.
- **Destination:** an existing skill and section, a scoped memory fact, a structural fix such as a check or script, or a new skill when the workflow recurs and no existing skill fits.

- Prefer a structural fix when a script, check, or config would enforce the lesson more reliably than prose.
- If a target skill already exists, read it first. If it already covers the lesson, say the problem was following it; don't add a duplicate.
- Don't turn a one-off into a rule. Note whether a lesson is global or project-specific.

## 3. Record candidates

Add a `Tooling review` section to the reflection file. Use a short numbered list with Lesson, Evidence, Proposal, and Destination for each candidate. These are candidates, not approved changes.

If nothing clears the bar, write `No durable tooling findings.` Don't fill a quota.

Don't edit skills, save memories, or implement fixes just yet.
