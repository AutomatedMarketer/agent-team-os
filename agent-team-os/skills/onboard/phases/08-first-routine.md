# Phase 8 — Your first routine

**Time:** 20 minutes
**Ends with:** a saved routine on a schedule, one successful **Run now**, and a run log in
the repo that the user did not write.

## Open with

> "Phase 8 of 11. This is the one. After this, your team works when you are not there."

## The thing you cannot demonstrate live

Routines cannot be set to fire five minutes from now — the shortest interval is one hour.
So the shape of this phase is: **set the schedule, press Run now to prove it works, come
back tomorrow and see that it fired on its own.**

Say that up front so nobody sits waiting.

## Steps

### 1. Create the routine

`claude.ai/code` → Routines → New. Point it at their repo.

### 2. Write the prompt

> "Run the research agent. Today's topic: what competitors in my market changed this week.
> Follow the run-log skill and commit both files."

Short prompts work here. Everything the agent needs to know is already in the repo.

### 3. Pick the model — and explain it

This is a teaching moment, not a dropdown. Say:

> "Every run of this draws from your Claude plan, the same as a chat does. Put the expensive
> model on something that runs all day and you will spend your allowance by lunch. So:
> agents that run often get Sonnet. Agents that need judgment or voice get Opus. Research
> runs daily and is tool-heavy, so it gets Sonnet."

Show them `shared/standards/model-card.md` in their repo. Every agent's model is in that
one table.

### 4. Set the schedule

Daily, 6am, their timezone.

### 5. Run now

Press it. Watch the session open. When it finishes:

```bash
git pull
```

There is a commit they did not write. Sit on that for a second — it is the point of the
whole course.

### 6. Check the allowance

Open `claude.ai/settings/usage`. Look at what a single run cost them. Say:

> "That is the number that decides how many agents you can schedule. We come back to this
> on team day."

## Check

- The routine appears in the routines list with a schedule attached
- `git log` shows a commit the user did not author
- A new file exists in `runs/<YYYY-MM>/` with `trigger` set to `schedule`
- That run log has a `session_url` that opens the transcript

## Homework

> "Do nothing tonight. Tomorrow morning, before you open your laptop properly, run
> `git pull` and open the newest file in `agents/research/output/`. That is your team
> working while you sleep."

## If it goes wrong

| What they saw | What to do |
|---|---|
| "/schedule is available with Claude for Enterprise" | An API key is set in the shell. Remove `ANTHROPIC_API_KEY` and restart. |
| The run started but committed nothing | The prompt did not say to commit. Add "and commit both files". |
| It ran on the wrong model | The routine's model selector wins over the repo setting. Change it in the routine. |
| Run now is greyed out | Free plan. Routines need Pro or higher. |
| It asked a question and stopped | The agent file's unattended-run instruction is missing. Run `/audit`. |
