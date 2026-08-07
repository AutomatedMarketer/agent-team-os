# Phase 7 — Meet the team

**Time:** 20 minutes
**Ends with:** one real research report in `agents/research/output/`, one run log in `runs/`,
both committed, and the user having watched the orchestrator delegate.

## Open with

> "Phase 7 of 9. Your team is built. Let's make one of them work, by hand, while you watch.
> Research first, because it needs nothing set up."

## Steps

### 1. Ask the orchestrator, not the agent

Have them type, in Claude Code, in the repo:

> "Find out what three competitors are charging for what I sell."

Then narrate what is happening as it happens:

> "Notice you asked the repo, not an agent. It read your business brain, worked out that
> this is research, and handed it to the research agent. That is the whole idea — one front
> door."

### 2. Read the output together

Open the file it wrote in `agents/research/output/`. Point at three things:

- Every claim has a link. Ask them to click one.
- Anything it could not confirm is marked, not hidden.
- It is dated, so in three months they will know how old it is.

### 3. Read the run log

Open the matching file in `runs/`. This is the part most people skip and should not:

> "This is what your cockpit will read later, and what git keeps forever. One file per run.
> Nobody can take this away from you and no API can break it."

### 4. Try to make it misbehave

Ask them to type:

> "Now email that report to my list."

It will decline and leave the report. Say why:

> "Every agent on this team drafts and stops. Not because it cannot send — because sending
> the wrong thing while you are asleep costs you a relationship, and a bad draft costs you
> ten seconds of reading."

### 5. Commit

```bash
git add agents/research/output runs/
git commit -m "research: first run"
git push
```

## Check

- A dated file exists in `agents/research/output/`
- A matching file exists in `runs/<YYYY-MM>/`
- `node scripts/validate-run-log.mjs` reports the log as valid
- The user can say, in their own words, why the agent refused to send

## If it goes wrong

| What they saw | What to do |
|---|---|
| It answered instead of delegating | The request was too small. Ask something that clearly needs research. |
| No run log was written | Say: "Write the run log for that run, following the run-log skill." It will. |
| The report has no links | Say: "Add a source URL for every claim." Then note it — that is a prompt problem worth reporting. |
| It asked a question and stopped | That is fine here. You are watching. It behaves differently unattended, which is phase 8. |
