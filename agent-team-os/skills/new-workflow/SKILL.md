---
name: new-workflow
description: Turns a conversation into one validated workflow file — a named job that chains existing skills on a schedule or a button — and registers it end to end. Trigger on /new-workflow, add a workflow, chain these skills, or I want this to run on its own.
---

# New workflow

You are adding a job to a team that already works. A skill does one task; a workflow gets
a job done — and it has to come out indistinguishable from the ones `/onboard` built,
because the dashboard renders them all from the same files.

The user talks; you write the file. They never edit YAML.

## Before you write anything

List the skills in `.claude/skills/` and the agents in `.claude/agents/` first, so every
question is answered against what actually exists. Then ask, one at a time:

| # | Ask | Why it matters |
|---|---|---|
| 1 | "In one sentence, what job does this get done?" | Becomes `name` and the file's slug. If it takes two sentences, it is two workflows. |
| 2 | "Which of your skills does it run, in what order?" | Becomes `steps`. Every one has to exist in `.claude/skills/` — a missing one gets built first, or the workflow waits. |
| 3 | "Which agent owns it?" | Becomes `owner`. One of the agents in `.claude/agents/`. Default to whichever agent already does the closest work. |
| 4 | "When should it run — a time, a day, or only when you press the button?" | Becomes `trigger`. |
| 5 | "Where should the result land so you actually read it?" | Becomes `output`. Default `inbox/{date}/<slug>.md` and say why: unique filenames never collide across machines. |
| 6 | "Will a person read what this makes, or is it just data for another job?" | Decides whether it gets graded. A person reads it, so it ends in `review-draft` and needs a standard - go to the three questions below. |

### If a person reads it, get the standard

Skip this only when the output is raw material for another workflow. Three questions, one at
a time, and **write their answers down verbatim** - taste does not survive being tidied into
house style:

1. **"When this job produces something good enough to use as-is, what does that look like?
   One sentence."** -> `looks_like`
2. **"What has to be in it every single time?"** -> `must_have`. Stop them at five; eight
   means it is two jobs, and say so.
3. **"What makes you delete it on sight?"** -> `never`. If they stall, ask what they took
   out of the last thing they rewrote. Do not offer examples - examples get agreed with.

Without this block a graded workflow has no standard to be graded against, and the repo's
own tests will fail it.

If they stall on question 1 or 2, the five unstick questions, one at a time:

1. What did you do three or more times last week?
2. What felt manual, boring, or copy-paste?
3. What could a sharp assistant handle, but explaining it takes longer than doing it?
4. If your volume tripled next month, what breaks first?
5. What would triple your volume?

## Choosing the trigger

From answer 4, and nothing else:

| They said | Write |
|---|---|
| A time or a day | `schedule:` in a spoken form — `daily 06:00`, `weekdays 09:30`, `weekly mon 06:00`, `monthly 1 08:00`, `every 2 hours`. Zero-padded, 24-hour, no cron. |
| "When I press the button" | `fire: true` and no schedule. |
| Both — the usual right answer | Both lines. It runs Monday morning whether they are there or not, and they can also fire it from their phone. |
| More often than hourly | Routines have a 60-minute floor. Add `runner: github-actions` — no floor, no daily cap — and check `/install-github-app` has been run once. Offer this only when hourly is genuinely too slow. |

Default `fire: true` on. A button costs nothing, and a workflow without one cannot be
started from the phone.

## What to write

Create `workflows/<slug>.yml` — kebab-case slug, matching the contract in
`workflows/README.md`:

```yaml
name: Monday Brief
owner: research
steps: [pull-calendar, scan-inbox, write-brief, review-draft]
trigger:
  schedule: "weekly mon 06:00"
  fire: true
  armed: false
  reason: "<what would have to change for this to be worth a run>"
output: inbox/{date}/monday-brief.md
done:
  looks_like: "<their sentence, verbatim>"
  must_have: [<their list, verbatim>]
  never: [<their list, verbatim>]
```

`review-draft` is always the **last** step, and it only appears alongside a `done` block -
the two ship together or neither does.

**`armed: false` and a `reason:` are not optional, and they are not a formality.** A `schedule:`
line makes nothing happen - a *routine* is the alarm clock - so a new file always arrives switched
off. `npm run check:arming` refuses a file without both, and it is right to: a job that armed
itself by existing would start spending runs the moment it was written.

Write the reason from what they just told you, in their words. "Off until you have a week of runs
to review" is a reason. "Not needed" is not - six weeks later it is indistinguishable from having
forgotten.

Then say this out loud, because it is the step people skip: **this job does not run yet.** When
they want it to, `/arm` asks for their run cap, creates the routine, and confirms it exists before
writing `armed: true`. Never tell them to create the routine themselves at `claude.ai/code` - a
routine ringing for a file that says `armed: false` is the **unapproved** state, and it is the one
that costs money.

Then read it back in one plain sentence, including what happens when it falls short: "Every
Monday at six, Research pulls your calendar, scans your inbox, and writes a brief into that
day's inbox folder. Your editor checks it against your standard first - if it misses, it
goes back once with the fix, and if it misses again you still get it, marked, with the
reason. There is also a button." Wait for a `go` before registering anything.

## Check

From the repo root, before anything is scheduled:

```bash
node --input-type=module -e "
import { readdir } from 'node:fs/promises'
import { loadWorkflows, validateWorkflow } from './scripts/lib/workflows.mjs'
const agents = (await readdir('.claude/agents')).map((f) => f.replace(/\.md$/, ''))
const skills = await readdir('.claude/skills')
let bad = 0
for (const { path, data } of await loadWorkflows()) {
  const problems = validateWorkflow(data, { agents, skills })
  if (problems.length) { bad += 1; console.log(path + ':\n  ' + problems.join('\n  ')) }
  else console.log(path + ' — valid')
}
process.exit(bad ? 1 : 0)
"
node --test
```

Both clean. If the validator reports a problem, fix the file — not the validator — and run
it again.

## Switch it on — later, and not from here

The file exists. Nothing rings yet, and that is correct: it shipped `armed: false` with a reason,
because a job that armed itself by existing would start spending the moment it was written.

**Do not create a routine for it.** Not here, not at `claude.ai/code`, not "just to test it". A
routine ringing for a file that says `armed: false` is the **unapproved** state — spend nobody
agreed to — and `npm run check:arming` exits non-zero on it.

When they want it to run, `/arm`:

1. Asks for their run cap first. It is a blocker, not a formality
2. Creates **one** routine, named after the workflow, on the workflow's own schedule, with the
   model from the owner's row in `shared/standards/model-card.md`
3. Calls back to confirm the routine actually exists — a create that returned without an error
   is not a routine that exists
4. Only then writes `armed: true` into the file, so the file and the alarm clock agree

One routine runs the whole chain: one run against the daily cap, not one per step.

**The button** — if it has `fire: true` and their dashboard is deployed: the workflow appears on
the board on the next visit, but the button dispatches nothing until its trigger URL is
registered. That happens after `/arm` has made the routine: open the routine, copy its trigger
URL, add `"<slug>": "<that URL>"` to `FIRE_TRIGGERS` in the Vercel project's environment
variables, redeploy. The URL goes into the Vercel form only — not into the repo, not into this
chat. If one gets pasted here anyway, tell them to regenerate it on the routine and do not repeat
it back.

## Report back

```markdown
## <Name> is live

**Chain:** <steps, in order>
**Owner:** <agent> on <model alias>
**Runs:** <schedule in plain words, or "button only"> — one run against the daily cap
**Lands in:** <output path>
**Button:** <wired / needs its trigger URL added to FIRE_TRIGGERS>
```
