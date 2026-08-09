# Phase 1 — Pre-flight

**5 minutes.** Three checks. Confirm, do not teach.

## What you are checking

| # | Check | How they confirm | If it fails |
|---|---|---|---|
| 1 | **Claude Pro or Max** | They can see their plan at `claude.ai/settings` | Stop. Free cannot run scheduled work. Everything else works — say so — but Monday will not happen |
| 2 | **Claude Code on the web** | `claude.ai/code` loads for them | Turn it on in settings. Two minutes |
| 3 | **GitHub connected to their Claude account** | Their GitHub username shows in Claude's settings | This is the one that stalls people. See below |

**There is no fourth check.** Google is not required — this build has no connectors in it.

## Ask them one at a time

> *"First: are you on Claude Pro or Max? Free will do everything today except the Monday
> morning part."*

Then check 2. Then check 3. **Never two questions in one message.**

## If GitHub is not connected

Do not troubleshoot it in depth and do not send them off to read anything.

1. Claude settings → connect GitHub → authorise. Roughly two minutes
2. **If their work laptop blocks it**, ask them to use a personal device or a personal
   GitHub account. A managed corporate device is a wall, not a problem to solve
3. **If they have no GitHub account at all**, this needed doing before today. Do not spend
   twenty minutes creating one now — set `own_account: false` in the state file, get them a
   spare repo to work in, and note that theirs comes later

That third case is recorded as a spare, not as a completion. It is a fine outcome for them
and a real one for the record.

## What to say when all three pass

> *"You're set. Next: your team gets somewhere to live. About twenty-five minutes, and most
> of it is you watching."*

## Do not

- Do not explain what GitHub is unless they ask. If they ask: *"a place your files live that
  isn't your laptop, so something can work on them while you're asleep."*
- Do not mention connectors, Gmail, or Calendar. They are not part of this
- Do not quote a limit on how many times things can run. Show them
  `claude.ai/settings/usage` instead, if it comes up

## Write to the state file

Set `started`, mark phase 1 complete, set `next_phase: 2`, and set `own_account`.
