# Phase 9 — Verify

**Time:** 15 minutes
**Ends with:** an audit report in `.agent-team/audit-log.md`, a state file marked complete,
and a user who can explain what they own.

## Open with

> "Phase 9 of 9. We check the work, then I get out of your way."

## Steps

### 1. Run the audit

Invoke the `audit` skill. It reads the repo and reports what exists, what is stale, and
what was never set up. Save the output to `.agent-team/audit-log.md`.

### 2. Read the report together

Go through it line by line. Anything red gets one of two responses:

- **Fixable now, under two minutes** — fix it.
- **Anything else** — write it into the report as a next step, with the phase that covers
  it. Do not fix it now. Finishing matters more than perfection at this point.

### 3. The three questions

Ask these out loud. If they cannot answer, go back to the phase named next to it.

| Question | If they cannot answer |
|---|---|
| "Where does your business information live, and why there?" | Phase 2 |
| "Why do your email and customer service agents never send?" | Phase 7 |
| "You want to add an agent that runs every hour. Which model, and why?" | Phase 8 |

### 4. What they own

Say it plainly, because it is the thing that separates this from renting software:

> "The repo is yours, on your GitHub. The routines are on your Claude account. Every run
> your team has ever done is in your git history. If we disappeared tomorrow, none of it
> stops working."

### 5. Close out

```bash
git add .agent-team/
git commit -m "onboard: complete"
git push
```

Set `install_complete: true` in `.agent-team/onboarding-state.md`.

## Check

- `.agent-team/audit-log.md` exists and is committed
- `.agent-team/onboarding-state.md` shows all nine phases `done` or `skipped`
- At least one routine exists with a schedule
- At least one commit was authored by an agent, not the user
- They answered all three questions

## What next

> "You have one agent working. The course adds four more, then a dashboard at your own URL.
> Nothing you have built gets replaced — it gets added to."
