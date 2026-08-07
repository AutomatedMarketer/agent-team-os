# Phase 2 — The repo

**Time:** 20 minutes
**Ends with:** a repo on their GitHub containing an orchestrator, five agents, and an empty
business brain, pushed and visible in a browser.

## The idea to land first

Say this, in these words, before you touch anything:

> "Everything your team needs lives in this repo. Not on your laptop — in the repo. When an
> agent runs at 6am, it runs on a computer in the cloud that clones this repo and nothing
> else. If a file is not committed, your agent cannot see it."

Then check they got it: "So where does your business information have to live?" Wait for
"in the repo". This one idea is why the rest of the course works.

## Steps

### 1. Name it

> "What do you want to call your team's repo? Most people use `my-agent-team`. Type a name
> or press enter for that."

### 2. Create it from the template

```bash
gh repo create <name> --private --template automatedmarketer/agent-team-template --clone
cd <name>
```

If `gh` is not installed or not signed in, the manual path is: open
`github.com/automatedmarketer/agent-team-template`, press **Use this template**, name it,
then clone it with the URL GitHub shows.

Private for now. They can make it public later if they want to show it off.

### 3. Look at what arrived

Walk them through it in plain English, one line each. Do not read the file tree at them —
name the five things that matter:

| What | Where | In one line |
|---|---|---|
| The orchestrator | `CLAUDE.md` | The one you talk to |
| The five agents | `.claude/agents/` | Research, content, email, customer service, sales |
| Your business | `shared/` | Empty for now. Phases 3 to 5 fill it. |
| Their work | `agents/<name>/output/` | Where you read what they did |
| The log | `runs/` | One file per run, forever, in your git history |

### 4. First commit and push

```bash
git add -A
git commit -m "chore: my agent team, from the template"
git push
```

Then: "Open the repo in your browser. Do you see it?"

## Check

- `gh repo view --web` opens a page that exists
- `CLAUDE.md`, `.claude/agents/`, `shared/`, `runs/` are all visible on GitHub
- `git status` is clean

Write the repo URL into the state file's `repo_url`.

## If it goes wrong

| What they saw | What to do |
|---|---|
| `gh: command not found` | Use the browser template path in step 2 |
| `Permission denied (publickey)` | Sign in with `gh auth login`, choose HTTPS |
| The repo exists but is empty | The template flag was dropped. Delete it and redo step 2. |
| Push rejected | `git pull --rebase` then push again |
