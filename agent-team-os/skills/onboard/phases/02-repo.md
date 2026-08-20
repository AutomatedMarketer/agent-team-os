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

### 6. The starter stack

The repo exists, so its `stack.yml` can be read. Run the `install-stack` skill now, before
anything else is built.

> "One more thing and it is the most important five minutes of the install. Four things
> every team gets: a way to find out what people are actually saying this month, a way to
> read official documentation instead of guessing at it, a memory that survives you closing
> the window, and an honest account of what this is costing you. I'll put them in and prove
> each one works."

Follow `.claude/skills/install-stack/SKILL.md` exactly. It is safe to run twice, so a repeat
later costs nothing.

Two things to hold to here:

- **Show each proof.** An installed plugin is not a working plugin, and the one that matters
  most is `last30days` coming back with **recent dates**. Let them see the dates.
- **Some of these load on the next session.** Say which, plainly, so a capability that is not
  answering yet does not read as a broken install.

If one fails, name it, say what the team does worse without it, give the fallback, and carry
on. A missing capability is not a reason to stop the install — it is a line in
`.agent-team/stack-check.md` and a card for later.

Then say the sentence that makes the rest of the install make sense:

> "From here on, your team looks things up instead of remembering them. Anything about a
> tool, a price, or a version is something it checks — because that is the difference
> between an assistant that is confident and one that is right."

## Check

- `gh repo view --web` opens a page that exists
- `CLAUDE.md`, `.claude/agents/`, `shared/`, `runs/` are all visible on GitHub
- `git status` is clean
- `.agent-team/stack-check.md` exists, and every capability in it is either verified or has
  a named reason and a fallback

Write the repo URL into the state file's `repo_url`.

## If it goes wrong

| What they saw | What to do |
|---|---|
| `gh: command not found` | Use the browser template path in step 2 |
| `Permission denied (publickey)` | Sign in with `gh auth login`, choose HTTPS |
| The repo exists but is empty | The template flag was dropped. Delete it and redo step 2. |
| Push rejected | `git pull --rebase` then push again |
| A plugin install fails | Name it, record it in `.agent-team/stack-check.md`, give the fallback from the install-stack skill, and continue. Never stop the install over one capability |
| A capability installs but will not answer | It probably needs a fresh session. Say so, note it as unverified, and re-check at the start of phase 3 |
