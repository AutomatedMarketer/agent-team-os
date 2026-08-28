# Phase 2 — The repo

**Time:** 25 minutes for the repo and the stack, plus 25 for `/ledger` if it is run here - so 50, or 25 when the ledger is deferred
**Ends with:** a repo on their GitHub containing eight workers, nine shipped jobs, and an empty
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
| The eight workers | `.claude/agents/` | Research, content, email, customer service, sales - plus editor, security and orchestrator, which keep the team honest |
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

### 5. The starter stack

The repo exists, so its `stack.yml` can be read. Run the `install-stack` skill now, before
anything else is built.

> "One more thing and it is the most important five minutes of the install. Five things
> every team gets: a way to find out what people are actually saying this month, a way to
> read official documentation instead of guessing at it, a memory that survives you closing
> the window, an honest account of what this is costing you, and a way to spend the part of
> your subscription you'd otherwise throw away each week. I'll put them in and prove each
> one works."

Follow `.claude/skills/install-stack/SKILL.md` exactly. It is safe to run twice, so a repeat
later costs nothing.

Three things to hold to here:

- **Show each proof.** An installed plugin is not a working plugin, and the one that matters
  most is `last30days` coming back with **recent dates**. Let them see the dates.
- **Calibrate the surplus burn to *this* owner.** Their weekly reset is not yours and not the
  template's. Run the probe (step 4b of the skill); if it cannot read the account, have them
  open `claude.ai/settings/usage` and read the reset line to you. Write it into
  `.claude/skills/surplus-burn/config.json` and prove it back with `surplus-check.mjs`.
- **Some of these load on the next session.** Say which, plainly, so a capability that is not
  answering yet does not read as a broken install.

If one fails, name it, say what the team does worse without it, give the fallback, and carry
on. A missing capability is not a reason to stop the install — it is a line in
`.agent-team/stack-check.md` and a card for later.

Then say the sentence that makes the rest of the install make sense:

> "From here on, your team looks things up instead of remembering them. Anything about a
> tool, a price, or a version is something it checks — because that is the difference
> between an assistant that is confident and one that is right."

## Then measure the week, before anything gets tailored

The repo now exists, which is the only thing `/ledger` was waiting for. Run it here, before
a single agent, job or connector is touched:

```
/ledger
```

About 25 minutes. It asks where their week actually goes and writes `ledger.yml` — what they
do, how often, how long it takes, and who acts on the result. It recommends nothing.

Say why the order is this way, once, in these words:

> "Everything after this gets decided by that file. Which jobs get switched on, which of your
> team matter, what still has to be built. So we measure the week before we build anything —
> because a wrong number here is obvious to you, and a wrong list of agents is not."

Do not continue to phase 3 until `npm run check:ledger` exits clean and the owner has said the
week reads right, **or** the ledger has been deliberately deferred (below). That agreement is the
gate, not the file existing.

### If they are measuring the week somewhere else

Some people arrive here having been told to do this part in a room, with somebody asking the
second question. That is a better ledger than one written alone at eleven at night, so do not
argue them out of it and do not quietly skip it either.

If they say they are measuring their week in a workshop or with someone else, **defer it**:

1. Say it back once - *"Then we leave the ledger empty for now. Nothing after this can be
   tailored to your week until it exists, so the next few phases stay generic on purpose."*
2. Write the deferral into `.agent-team/onboarding-state.md`, on its own line:
   `ledger: deferred - being measured live, revisit before phase 10`
3. Carry on to phase 3.

**A deferral is not a skip.** It is written down and it names when it comes back, and phase 10
reads that line before it chains anything. Anything derived from the week before then
is generic by admission rather than by accident.

## Check

- `gh repo view --web` opens a page that exists
- `CLAUDE.md`, `.claude/agents/`, `shared/`, `runs/` are all visible on GitHub
- `git status` is clean
- `.agent-team/stack-check.md` exists, and every capability in it is either verified or has
  a named reason and a fallback
- `.claude/skills/surplus-burn/config.json` has a real `resetWeekday` and `resetHour` for
  this owner — not `null`, not copied
- **Either** `ledger.yml` exists and is committed, `npm run check:ledger` exits clean, and the
  owner has said out loud that the week reads right — **or** the ledger is deferred and
  `.agent-team/onboarding-state.md` carries the `ledger: deferred` line saying so. One or the
  other. Not neither, and never a silent skip

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
