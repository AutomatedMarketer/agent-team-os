# Phase 2 — The repo

**25 minutes.** Their team lands in their own account. No agent does anything useful today —
today they get the office.

## The idea, said once, in these words

> **Everything your team needs lives in the repo. Not on your laptop — in the repo.**

Then why:

> *"Monday at six, your laptop is shut. Somewhere a fresh computer starts up, reads this
> folder, does the work, writes the result back, and shuts down. It never sees your laptop.
> If something isn't in here, your team can't see it."*

Ask them to say it back before you move on. If they cannot, say it again. This is the one
idea the rest depends on.

## What to do

Browser only. **Do not show them a command.**

1. Go to `github.com/automatedmarketer/ceo-team-template`
2. Press **Use this template** → **Create a new repository**
3. Name it — theirs to choose. `my-ceo-team` is fine
4. **Private.** Not a default they can change. Their numbers and their team go in here
5. Create

> **Use this template, not Fork.** A fork stays tied to the original. A template gives them
> a clean copy that is theirs from the first second, with no connection back.

## Then open it in Claude

At `claude.ai/code`, open the new repo. That is where the rest happens.

## What to show them, briefly

Five things. Ignore everything else.

| What | Where | In one line |
|---|---|---|
| The Chief of Staff | `CLAUDE.md` | The one you talk to |
| The four specialists | `.claude/agents/` | One file each. Job descriptions, in English |
| Your business | `shared/` | Empty. That is the next phase |
| Your briefs | `briefs/` | One page a week. There's an example in there |
| The log | `runs/` | Every run, kept forever |

**Open `briefs/EXAMPLE-monday.md` and let them read it.** Ninety seconds. That is the whole
product and it lands harder than anything you can say about it.

Then open `.claude/agents/people.md` and show them one thing:

> *"See this — it's not allowed to tell you what Sarah needs. It can tell you that you
> haven't mentioned her in five weeks. It counts; it doesn't guess about people."*

That single detail is what makes a CEO trust the rest of it.

## Troubleshooting

| What they saw | What to do |
|---|---|
| The repo was created but is empty | The template did not apply. Delete it and redo — check they pressed **Use this template**, not **Fork** |
| They cannot find **Use this template** | They are signed out, or on a phone. Desktop browser, signed in |
| Claude cannot see the new repo | Start a new session at `claude.ai/code`. Repos attach at session start |
| They made it public by accident | Fix it now, before the next phase. Settings → General → Danger Zone → change visibility. Their numbers go in next |
| "Should it be private?" | Yes. Always. They can show it off later if they want |

## What to say at the end

> *"That page is your team. Nobody else can see it. Next we tell them who they work for —
> that's the half hour that decides how good Monday is."*

## Write to the state file

`repo_url`, phase 2 complete, `next_phase: 3`. Commit.
