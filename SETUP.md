# Setup prompt

You are setting up pi on a fresh machine. This repo is cloned as `~/.pi`, so config paths below are relative to the repo. When unsure where a setting lives, check the pi docs (`docs/` in the installed `@earendil-works/pi-coding-agent` package).

## Extensions

Install:

```
pi install npm:pi-web-access
pi install npm:pi-memory
pi install npm:@vanillagreen/pi-prompt-stash
pi install npm:@vanillagreen/pi-background-tasks
pi install npm:@juicesharp/rpiv-todo
pi install npm:@juicesharp/rpiv-ask-user-question
```

## pi-memory

Install qmd (pi-memory's memory backend) and make it download the re-ranker and re-worder models.

## pi-background-tasks patches

1. Patch the installed extension so command completion notifications are delivered as steer messages, not `followUp`s.
2. Disable autobackgrounding — set in `agent/settings.json`:

```json
"kendex": {
  "extensionManager": {
    "config": {
      "@vanillagreen/pi-background-tasks": {
        "autoBackgroundBash": false
      }
    }
  }
}
```

## Tools

- Install agent-browser: `npm i -g agent-browser && agent-browser install`

## Skills

- Install the agent-browser skill: `npx skills add vercel-labs/agent-browser -g -a pi`
- Install find-skills: `npx skills add vercel-labs/skills --skill find-skills -g -a pi`

## Keybindings

Merge into `agent/keybindings.json`:

```json
{
  "tui.editor.cursorUp": ["up", "ctrl+p"],
  "tui.editor.cursorDown": ["down", "ctrl+n"],
  "tui.input.newLine": ["shift+enter", "ctrl+j"],
  "app.model.cycleForward": ["f6"],
  "app.model.cycleBackward": []
}
```
