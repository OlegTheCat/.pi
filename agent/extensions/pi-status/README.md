# Pi active-session status

Local, dependency-free publisher for the Emacs Spaceline integration in
`~/.spacemacs.d/config/pi-status.el`. Inspired by
[pi-monitor-heartbeat](https://github.com/hunter-micro1/pi-monitor/tree/main/extensions/pi-monitor-heartbeat)'s
atomic per-process sidecar design; implemented against Pi 1.4's lifecycle API.

## States

- `running`: Pi is not idle. Includes model requests, tool execution, automatic
  retries/continuations and manual or automatic compaction.
- `waiting`: `@juicesharp/rpiv-ask-user-question` emits
  `rpiv:ask-user:blocked` with `active: true`. Overrides running until the
  matching `active: false` (answer, cancellation or failure). Works independently
  of whether the question is called directly or through codemode.
- Idle: no file, not counted. Background tasks alone do not keep an idle agent
  counted. Other questionnaire packages are not currently supported.

## Protocol

`$PI_CODING_AGENT_DIR/run-status/<pid>.json`, defaulting to
`~/.pi/agent/run-status/<pid>.json`:

```json
{"version":1,"pid":12345,"state":"running","updatedAt":1793000000000}
```

`updatedAt` is Unix milliseconds. Writes are atomic, using a sibling `.tmp`
file, with directory mode 0700 and file mode 0600 on creation. No prompts,
answers or session transcripts are written. The publisher refreshes every two
seconds and on relevant lifecycle events; normal shutdown/reload removes its
file. File I/O failures never stop Pi. Consumers should ignore stale records
(Emacs uses ten seconds), dead PIDs, malformed data and unsupported versions.

## Enable

The directory is auto-discovered under `~/.pi/agent/extensions/`. Run `/reload`
in **each already-open Pi session**, or start a new session. There are no extra
npm dependencies and no tmux requirement.

Emacs enables its reader when `config/pi-status.el` loads. It polls every second
and displays one of:

- `π ▶: 3, ⏸: 1`
- `π ▶: 3`
- `π ⏸: 1`
- Nothing when both counts are zero.

Typical update latency is one second; transitions without an extension event
(e.g. manual compaction completion) can take up to three seconds. Customize
`my/pi-status-directory` in Emacs if using a nondefault Pi agent directory.
`M-x my/pi-status-mode` toggles the Emacs reader.

## Tests

```sh
node --experimental-strip-types --test ~/.pi/agent/extensions/pi-status/index.test.ts
cd ~/.spacemacs.d && ./run-tests.sh 'pi-status-.*'
```
