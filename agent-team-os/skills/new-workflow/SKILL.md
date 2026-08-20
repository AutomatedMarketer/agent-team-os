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
steps: [pull-calendar, scan-inbox, write-brief]
trigger:
  schedule: "weekly mon 06:00"
  fire: true
output: inbox/{date}/monday-brief.md
```

Then read it back in one plain sentence: "Every Monday at six, Research pulls your
calendar, scans your inbox, and writes a brief into that day's inbox folder. There is also
a button." Wait for a `go` before registering anything.

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

## Register it

1. **The routine** — if it has a `schedule`: `claude.ai/code` → Routines → New, pointed at
   their repo, schedule matching the file, model from the owner's row in
   `shared/standards/model-card.md`. The prompt:

   > "Run the <name> workflow: read `workflows/<slug>.yml`, run each step in order as the
   > owner agent, write the result to the output path, follow the run-log skill and commit
   > both files."

   One routine runs the whole chain — that is one run against the daily cap, not one per
   step.

2. **The button** — if it has `fire: true` and their dashboard is deployed: the workflow
   appears on the board on the next visit, but the button dispatches nothing until its
   trigger URL is registered. Walk them through it: open the routine, copy its trigger
   URL, add `"<slug>": "<that URL>"` to `FIRE_TRIGGERS` in the Vercel project's
   environment variables, redeploy. The URL goes into the Vercel form only — not into the
   repo, not into this chat. If one gets pasted here anyway, tell them to regenerate it on
   the routine and do not repeat it back.

3. **Prove it** — press **Run now** on the routine (or tap the new button), and confirm a
   commit lands with the output file at the workflow's `output` path.

```bash
git add workflows/<slug>.yml
git commit -m "feat: <slug> workflow"
git push
```

## Report back

```markdown
## <Name> is live

**Chain:** <steps, in order>
**Owner:** <agent> on <model alias>
**Runs:** <schedule in plain words, or "button only"> — one run against the daily cap
**Lands in:** <output path>
**Button:** <wired / needs its trigger URL added to FIRE_TRIGGERS>
```
