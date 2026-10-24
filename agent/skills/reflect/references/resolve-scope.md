# Locate the transcript

Resolve the `<from>` argument to a boundary record, then work with the suffix of the active branch from that record to now. Don't review it yet.

*Note*: This stage runs only when the user passed an argument. Otherwise, skip it entirely and start judgment review using the conversation currently in context.

## 1. Find the session file

Run through pi's bash tool:

```bash
printf 'session_id=%s\nsession_file=%s\n' "$PI_SESSION_ID" "$PI_SESSION_FILE"
```

Use that exact file; don't search other sessions. Its first line should be a `type: "session"` record whose `id` matches `PI_SESSION_ID`. Don't follow `parentSession` into another session.

## 2. Walk the active branch

The file is a tree: entries link to their parent through `parentId`, and abandoned branches share the same file. Start from the last complete entry, follow `parentId` back to the root, and reverse the result.

- Original messages before a compaction stay in the file; include them.
- Don't follow a `branch_summary` into the branch it describes.
- Parse the JSONL and build a compact digest (id, timestamp, role, first line of content) instead of reading the whole file into context; expand individual records on demand.

If the file is missing, doesn't match, or the branch can't be established, fall back to the conversation in context and tell the user.

## 3. Resolve `<from>`

The argument is a free-form description of a starting point — a time (`00:00 today`, `since 14:00`) or an event (`live testing in browser`). Find the first record on the walked branch that matches; that record is the boundary.

- Named anchors: **context start** = the latest summary record on the branch, or the session start if there was no compaction; **session start** = the session root.
- Times are local; transcript timestamps are UTC ISO-8601 — convert before comparing (`date -d 'today 00:00' -u +%Y-%m-%dT%H:%M:%SZ`).
- Ambiguous between several candidate points: pick what the phrasing suggests, or ask. Not found in this session file: say so and offer the session start.

The review scope is the suffix from the boundary to the end of the branch — a hard cut. Earlier records leave the working set but stay reachable: if a judgment needs the setup, pull the specific records back by id and note the lookback. Frequent lookbacks usually mean the boundary is too late — surface that instead of tolerating it.

## 4. Record the source

In the reflection file, note the session file, the boundary record (id and timestamp), and any lookbacks made during review. Don't copy the transcript itself.
