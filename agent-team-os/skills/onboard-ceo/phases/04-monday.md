# Phase 4 — Monday

**20 minutes.** The routine gets created, then it runs, and the thing it produces is their
first brief. One event, not two.

## Say this before anything else

> **"You will not see a 6am run today. A schedule can't be set for five minutes from now.
> So we'll press Run now — that proves it works. Tomorrow morning proves it works without
> you, and I'll check and tell you."**

Say it **before** they touch anything. If you skip it, they sit waiting for something that
cannot happen, and the best moment in the session lands as an anticlimax.

## What to do

1. **Create the routine.** In Claude on the web, a scheduled task against their repo, weekly,
   Monday 06:00 in their timezone.

2. **The prompt.** This is the whole job description for the run:

> *Read CLAUDE.md and everything in shared/. Write this week's Monday Brief to
> briefs/YYYY-MM-DD-monday.md following briefs/_TEMPLATE.md exactly — all six blocks, in
> order. Tag every claim with its source. Write "not measured" for any number not in the
> repo; never estimate one. Then write a run log to runs/YYYY-MM/ and commit both files
> together.*

**"and commit both files" is load-bearing.** Without it a run happily produces a brief that
nobody can find, which reads as the system being broken.

3. **The model.** Sonnet is right for this. Do not put Opus on a weekly job — explain in one
   line that it is a bigger, slower, more expensive tool than this needs.

4. **Save the schedule.**

5. **Run now.** If the room is doing this together, count them in — three, two, one — so the
   wait is shared instead of eight people staring at their own screen.

6. **Wait.** Four to eight minutes. Fill it (see below).

7. **Open GitHub.** Show them the commit list.

> *"There's an entry there you didn't write. Open it."*

Give it a beat of silence. Then open the brief inside it.

## Filling the wait

Two questions are coming anyway. Answer them here, while everyone is watching a progress bar,
rather than cramming them into the close.

**"But I run four companies."**
> One file per business. Copy one, change it, the brief grows a section for it on the next
> run. Nothing else changes. Five minutes per business, whenever they like.

**"Is my data safe?"**
> The repo is private, in their own account. It is not shared with the other people in the
> room and not with whoever ran the session. Then answer the real question — what the model
> reads, what is retained — from the prepared note. **Do not improvise this one.** If you do
> not have the note, say you will send it rather than guess.

## If Run now fails for somebody

Do not debug it in front of the room.

> *"Yours will run tomorrow at six anyway. Let's get you a brief right now."*

Have them paste the prompt above straight into Claude on their repo. Three minutes, same
output. **They are not behind.**

Note it in the state file as a manual first brief. It matters for tomorrow's check, and a
record that blurs it cannot tell you whether the schedule actually works.

## What they should be looking at

Their own brief, about their own business. Block 6 will be long — **that is correct and you
should say so before they read it**:

> *"Block six is what it couldn't see. It's long today because you've had it for twenty
> minutes. Every line in there is a thing you can give it, and next Monday is better for it."*

That reframe turns the weakest part of the first brief into the reason to come back.

## Write to the state file

`first_brief` = the filename, phase 4 complete, `next_phase: 5`.
