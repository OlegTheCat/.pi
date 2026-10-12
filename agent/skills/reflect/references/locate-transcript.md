# Locate the transcript

Find the full active branch of the current session, including messages from before compaction. Don't review it yet.

*Note*: This stage runs only when the user asked for full history. Otherwise, skip it entirely and start judgment review using the conversation currently in context.

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
- Parse the JSONL instead of reading the whole file into context.

If the file is missing, doesn't match, or the branch can't be established, fall back to the conversation in context and tell the user.

## 3. Record the source

In the reflection file, note the session file and any fallback or gaps. Don't copy the transcript itself.
