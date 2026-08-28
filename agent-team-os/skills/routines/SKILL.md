---
name: routines
description: Shows every scheduled cloud routine on the owner's account - when each one fires, when it last ran, and which repo it works in. Trigger on /routines, what is scheduled, what jobs do I have running, list my routines, what runs automatically, or show my cron jobs.
---

# Your routines

A **workflow file** in a team repo is a job description. It says what the job is, who owns
it, and when it should happen. It does not make anything happen.

A **routine** is the alarm clock. It is the thing that actually wakes up at the appointed
time, starts a cloud session, and sets an agent to work.

The two are easy to confuse, and confusing them is expensive: a repo can describe ten jobs
while only one alarm clock exists, and every dashboard reading those files will report ten
jobs running. This command shows the alarm clocks, and only the alarm clocks.

It changes nothing about your routines: it cannot arm, pause, reschedule or delete one. The only
thing it writes is a snapshot of what it found, into your own repo, so that things which cannot
call this API - the dashboard, `/arm` - can still see the truth.

## What to do

### 1. Fetch the routines

```
RemoteTrigger { action: "list" }
```

The response is JSON with a `data` array. Every entry is one routine.

### 2. Fetch the run history for each one

The list response has no "last run" field — it does not exist on the API. Getting it costs
one call per routine:

```
RemoteTrigger { action: "list_runs", trigger_id: "<id>" }
```

Do this for every routine. Collect the results into an object keyed by trigger id.

**An empty run list does not mean the routine never ran.** The API only records fires that
got as far as creating a session. A fire refused earlier — the routine paused, a rate
limit, a repo it could not clone — leaves no row at all. Report "no runs found". Never
report "never ran"; that is an accusation the data does not support.

### 3. Render it

Write the two results to one JSON file and pipe it through the formatter. Do not format the
table yourself — the cron parsing and timezone arithmetic have tests, and doing it by hand
is how monthly jobs get reported as daily.

```bash
node "<skill_dir>/format-routines.mjs" < payload.json
```

The payload shape:

```json
{
  "routines": [ ...the data array from list... ],
  "runs": { "trig_abc123": [ ...the data array from list_runs... ] }
}
```

The formatter reads the machine's own timezone. Override it with `ROUTINES_TZ` if the owner
wants another one — `ROUTINES_TZ=America/New_York`.

### 4. Commit the snapshot

The dashboard is a web app reading the team repo on GitHub. It cannot call this API - no browser
can. So the only way what you just fetched reaches the board is if you write it down.

Write `.agent-team/routines.json` in the team repo and commit it:

```json
{
  "takenAt": "2026-08-27T18:40:00Z",
  "routines": [ ...the data array from list... ]
}
```

**`takenAt` is not optional.** `npm run check:arming` reads it, refuses to treat an unstamped
file as current, and says out loud when the snapshot is more than a day old - because a snapshot
presented as live is the same class of lie as a workflow file claiming a schedule nothing fires.
If you cannot stamp it, do not write it.

`/arm` compares against this file. **The dashboard does not read it yet** - that is the next piece
of work, not something already true. Say so if anybody asks.

### 5. Read the result back

Print the table. Then say, in plain words, only what is actually worth saying:

- Anything marked `!` — disabled, suspended, or a one-shot that already fired. A one-shot
  that has fired is dead weight; **it can only be removed at claude.ai/code/routines**,
  because the API has no delete.
- Anything whose last run is much older than its schedule implies. A job that fires daily
  and last ran nine days ago has stopped working, whatever its settings say.
- Anything overdue.

If everything is healthy, say so in one line. Do not pad.

## Rules

- **Never show a routine id.** Use its name. Ids are held internally for the commands that
  act on a routine; on screen they are noise.
- **Never print a UTC time.** The API stores UTC. People live in their own timezone, and a
  routine described as firing at 10:30 when the owner experiences 6:30 is a wrong answer.
- **Never invent a schedule you could not parse.** The formatter returns
  `unrecognised schedule` on purpose. Repeat that rather than guessing.
- **Do not compare against the repo's `workflows/` files here.** That comparison is a
  separate command. This one answers a single question: what is actually scheduled.
