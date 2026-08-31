---
name: audit
description: Checks an agent team repo and reports what works, what is stale, and what was never set up. Trigger on /audit, audit my team, check my setup, or what is broken.
---

# Audit — what is working, what is stale, what was never set up

You are checking someone's agent team and telling them the truth about it. Findings, not
reassurance. If something is missing, say so and say which lesson covers it.

## What to read

| Read | For |
|---|---|
| `.claude/agents/*.md` | Which agents exist, and what model each declares |
| `shared/*.md` | Whether the business brain is filled in |
| `agents/*/knowledge/*.md` | Whether the FAQ and offer sheet are filled in |
| `runs/2*/*.json` | What has actually run, and when. **Not** `runs/**/*.json` — that also pulls in `runs/heartbeat/*.json`, which is not a run at all but one liveness ping per runtime, in a different shape entirely |
| `.claude/settings.json` | Model and effort at repo level |
| `git log --format='%an %ad %s'` | Who committed what, and when |

If the repo ships `npm test`, run it. A green suite is stronger evidence than anything you
can read by eye, and it is faster.

## The report

Write it in this shape. Keep the whole thing under a page.

```markdown
# Team audit — <date>

## The one-line verdict
<Working / working with gaps / not yet running unattended.>

## Your agents

| Agent | Model | Last run | Runs in the last 7 days | State |
|---|---|---|---|---|
```

`State` is one of:

- **Working** — ran in the last 7 days, latest run status `ok`
- **Stale** — exists, but has not run in more than 7 days
- **Never run** — defined, but there is no run log for it
- **Not set up** — the agent's connector or knowledge file is empty, so it cannot work yet
- **Not in use** — the knowledge file says, in words, that this agent does not apply to this
  owner. Not a gap. Quote the reason in the State cell and **do not list it under "What is
  missing"**

**The difference between the last two matters more than it looks.** Not all five agents apply to
everyone — someone who works for the business rather than owning it usually has no prospects and
no customers of their own, and the course says so on Day 1. An empty `offer-sheet.md` because
nobody got to it is a gap. An `offer-sheet.md` that says *"I do not sell - that is the
estimator's job"* is a finished answer, and reporting it as missing teaches the owner to ignore
your report. **Read the file before deciding which one it is.**

```markdown
## Your business brain

| File | Filled in | Empty fields |
|---|---|---|

## What is missing

<One row per gap: what is missing, what it stops, and the lesson that covers it.>

## Safety

<Anything that could send, post, spend, or delete. Should be nothing. If it is not
nothing, put it at the top of the report instead of here.>

## Do these three things next

<Three items, most valuable first. Each one a sentence, each one doable in under an hour.>
```

## How to count empty fields

```bash
grep -o '<!-- fill: [a-z0-9-]* -->' shared/about-me.md shared/business-brain.md shared/writing-rules.md
```

That prints one line per unfilled field, `file:marker`, so the count is `| wc -l` and the names
are already in front of you.

**Do not use `grep -c` for this.** It counts *lines that contain* a match, not matches, and
`business-brain.md` puts two markers on one row in the verified-claims table — so `grep -c`
reports 11 where the truth is 14. The dashboard counts occurrences, so a `-c` count makes your
report and their board disagree about the same repo, which is the one thing an audit must never do.

Anything above zero is an unfilled field. Name the specific markers, not just the count —
"you are missing your voice samples" is actionable, "3 fields missing" is not.

## How to read run logs

Each file in `runs/<YYYY-MM>/` is one run. Sort by `started_at`. For each agent, the newest
entry gives you last-run and status. A run with status `blocked` usually means a missing
connector or an empty knowledge file — say which, from the summary field.

If a run log fails validation, that is a finding:

```bash
node scripts/validate-run-log.mjs
```

## Tone

Plain. Specific. No praise for things that merely exist. "Five agents defined, one of them
has ever run" is a more useful sentence than "great setup".

Where something is genuinely good, one clause is enough, then move on to what is not.
