---
name: arm
description: Compares the jobs a repo declares against the routines that actually exist, and switches on only the ones the owner approved - each with a reason. Trigger on /arm, switch it on, make it run, arm my jobs, why is nothing running, or which of my jobs are real.
audience: team
---

# Arm what was approved

A workflow file says *this job should happen at 06:30*. A routine is the alarm clock that
actually rings. Nothing connects them until somebody arms one, and until then the file is a wish.

This is the command that closes that gap — deliberately, one job at a time, with a human saying
yes to each.

**Say this out loud once:** nothing runs because it looked useful. It runs because they approved
the reason it runs, and every job left off keeps a written reason too.

## Before you start

Three things, and the first one is a blocker.

1. **They need to know their run cap.** Arming spends runs on a schedule, forever, whether or not
   anyone reads the output. If they cannot say how many scheduled runs their plan includes, stop
   and send them to `claude.ai/settings/usage`. Do not guess it, and do not arm "just one to see".
2. `proposals.yml` must exist and pass `npm run check:proposals`. You arm what was approved, and
   approval lives in that file.
3. Run `/routines` first so you both know what already exists. Arming a second routine for a job
   that already has one is how a daily brief starts arriving twice.

## 1. Compare the two lists

From the team repo:

```bash
npm run check:arming
```

That reads the snapshot safely - on a fresh clone, where `.agent-team/routines.json` does not
exist yet, it says so instead of crashing - and prints four lists. Two of them cost something:

| | What it means | What it costs |
|---|---|---|
| **armed** | The file says run it, and a routine exists | Runs, on schedule |
| **declared** | The file says run it, and **nothing rings** | Nothing. It is a wish. |
| **unapproved** | A routine **rings**, and the file says it is off | Runs nobody approved |
| **off** | Deliberately not armed, with a written reason | Nothing, honestly |

**If it says there is no usable snapshot, run `/routines` first.** Without one this can only report
what the files claim, and a file claiming a schedule is the exact thing you came here to check.

Plus **orphans**: routines pointing at this repo with no workflow file behind them. Report those;
do not act on them.

**`declared` is the bug this whole build exists to kill.** This repo describes nine jobs against
one real alarm clock, and every board reading those files cheerfully reported nine jobs running.
If anything is in `declared`, say the number out loud before you do anything else.

**`unapproved` is the same bug pointing the other way, and it is the expensive one.** Something is
firing that the file never approved - real runs, spent every day, on a job nobody said yes to.
Say that number out loud too, and say what it is costing.

## 2. Arm one, and only what they approved

For each job they say yes to:

```
RemoteTrigger {
  action: "create",
  name: "<workflow name>",
  schedule: "<the workflow's own schedule>",
  prompt: "<what the job should do, from the workflow file>",
  repo: "<owner>/<repo>"
}
```

Then, in the same breath:

```
RemoteTrigger { action: "list" }
```

**A create you did not confirm did not happen.** The call returning without an error is not the
same as a routine existing, and this is exactly the class of claim the rest of this system refuses
to make. Confirm it, then set `armed: true` in the workflow file and commit.

Arm them **one at a time**, confirming each. Not in a batch. A batch that half-fails leaves a repo
whose files disagree with reality, which is the state you were called here to fix.

## 3. Write the reason for everything left off

Every job not armed gets `armed: false` and a `reason:` in its own file:

```yaml
trigger:
  schedule: "daily 06:30"
  armed: false
  reason: "Left off until the run cap is known - nobody reads a second daily brief anyway"
```

The file stays. Nothing is deleted. One line changes later when they want it on.

**And when you DO arm one, delete its `reason:`.** The reason says why it is off; leaving it behind
prints a job under "Armed" with "Off until you know your run cap" underneath it.

A reason is required and it is checked. "Not needed" is not a reason — say what would have to
change for it to be worth a run.

## 4. Read it back

> "You have N jobs armed, spending N runs a week. M are switched off, and here is why each one is.
> Nothing else in the repo is pretending to run."

## Check

- [ ] They said their run cap out loud before anything was armed
- [ ] Every armed job was confirmed present by a `list` after its `create`
- [ ] Every armed job has `armed: true` in its file, committed
- [ ] Every job left off has `armed: false` **and a written reason**, committed
- [ ] `declared` is empty — nothing claims a schedule that no routine backs
- [ ] `unapproved` is empty — nothing is firing that the file never approved
- [ ] `npm run check:arming` exits clean — a declared job is a problem, so this cannot pass while
      any job claims a schedule nothing backs
- [ ] Orphan routines were reported, not silently adopted

## What this skill must never do

- **Never arm anything their ledger did not ask for.** Concretely, a workflow is armable when
  `proposals.yml` names it as `workflow:<slug>`, **or** when its `steps:` are skills approved
  there as `skill:<slug>`, **or** when its `owner:` is an agent approved there as `agent:<slug>`.
  Anything else was not approved, and it does not run.

  This matters because most proposals name a **skill** or an **agent**, not a workflow — a
  proposal is a decision about *work*, and a workflow is how that work gets a clock. `/new-workflow`
  is the step in between. A student who approved `skill:triage-inbox` on Monday and chained it
  into `inbox-triage` on Wednesday has approved that job; say so out loud when you arm it, naming
  the proposal line it traces back to. If a workflow traces back to nothing in `proposals.yml`,
  do not arm it — ask them to run `/match` again now that the job exists.
- **Never arm in a batch.** One at a time, each confirmed.
- **Never claim a routine exists without a `list` that shows it.**
- **Never delete a routine.** The API has no delete — only `claude.ai/code/routines` can. Say that
  plainly rather than pretending to remove something.
- **Never leave a job off without a reason.** An unexplained silence is indistinguishable from a
  mistake six weeks later.
- **Never guess the run cap.** It is the one number that decides whether any of this is affordable.
