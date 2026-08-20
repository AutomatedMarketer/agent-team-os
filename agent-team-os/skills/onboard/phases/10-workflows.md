# Phase 10 — Workflows

**Time:** 40 minutes
**Ends with:** at least two workflow files in `workflows/`, each valid, each registered as a
scheduled routine, and a dashboard board chosen in `tiles.yml`.

This is stage 4 of 5, and it is the one that makes this a team instead of a toolbox. A skill
does one task. A workflow gets a job done — several skills chained, on a schedule, with the
result landing somewhere the user will actually find it.

## Open with

> "Phase 10 of 11: workflows. Up to now, everything your team does starts with you asking.
> This phase chains your skills into named jobs that run on their own. Laptop closed,
> something still happens. About forty minutes."

## The rule of this phase

The user talks; you write the files. They never edit YAML, and you never ask them to. If
they ask to see a file, show it and translate it back into plain English line by line.

## Steps

### 1. Lay out what they have

List every skill in `.claude/skills/` and every agent in `.claude/agents/`, in plain words:

> "Here is what your team can do today, one line each. We are going to pick which of these
> belong together as one job."

### 2. Interview — which of these run together, and when?

One question at a time:

1. "Which of these do you already trigger back to back, or wish ran as one thing?"
2. "When should that job run — a time of day, a day of the week, or only when you press
   a button?"
3. "Where should the result land so you actually read it?" (Default: `inbox/{date}/…` —
   say why: every filename is unique there, so nothing ever collides.)

If they stall, use the five unstick questions, one at a time, until something surfaces:

1. What did you do three or more times last week?
2. What felt manual, boring, or copy-paste?
3. What could a sharp assistant handle, but explaining it takes longer than doing it?
4. If your volume tripled next month, what breaks first?
5. What would triple your volume?

You need at least two jobs before moving on. A morning brief and a weekly review are the
usual first two if nothing else surfaces.

### 3. Write the workflow files

For each job, write `workflows/<slug>.yml` yourself, shaped exactly like the contract in
`workflows/README.md` in their repo:

```yaml
name: Monday Brief
owner: research
steps: [pull-calendar, scan-inbox, write-brief]
trigger:
  schedule: "weekly mon 06:00"
  fire: true
output: inbox/{date}/monday-brief.md
```

Rules the file has to obey — the validator enforces every one of them, so get them right
here rather than discovering them in step 4:

- `owner` is one of the agents in `.claude/agents/`.
- Every step is a skill that exists in `.claude/skills/`. If a step they want does not
  exist yet, stop and build the skill first — a workflow that names a missing skill fails
  validation, and it should.
- `schedule` uses the spoken forms from `workflows/README.md` — `daily 06:00`,
  `weekly mon 06:00`, `every 2 hours`. Times zero-padded, 24-hour. No cron.
- Routines will not fire more often than once an hour. A schedule under the 60-minute
  floor needs `runner: github-actions`, and that needs `/install-github-app` run once.
  Offer that only if they genuinely need sub-hourly; most people do not.
- `output` stays inside the repo. `inbox/{date}/<slug>.md` is the default.
- `fire: true` on anything they might want to start from their phone. It costs nothing
  and phase 11 turns it into a button.

Read each finished file back in one plain sentence: "Every Monday at six, Research pulls
your calendar, scans your inbox, and writes a brief into that day's inbox folder."

### 4. Validate

From the repo root:

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
```

Every file valid before anything gets scheduled. If a problem is reported, fix the file —
not the validator — and run it again.

### 5. Register the routines

One routine per workflow, at `claude.ai/code` → Routines → New, pointed at their repo.
The whole chain is one routine — that is the point. Four skills chained cost one run
against the daily cap, not four.

The routine prompt, for each workflow:

> "Run the <name> workflow: read `workflows/<slug>.yml`, run each step in order as the
> owner agent, write the result to the output path, follow the run-log skill and commit
> both files."

Schedule matches the file's `schedule` line. Model comes from the owner agent's row in
`shared/standards/model-card.md`. Press **Run now** on the first one and watch it finish —
same proof moment as phase 8.

### 6. Choose the dashboard board

`tiles.yml` is the file the dashboard reads. Four tiles are always there — Today,
Workflows, Agents, Overnight. The user picks up to four more from `tiles/catalogue.json`.

- Ask the catalogue's own questions, one at a time — "Where does the money show up?",
  "Where do your leads live?" — and only for tiles whose question they answer with a real
  tool. A tile with nothing wired behind it renders an empty box.
- Ask for the hero: "One number at the top of your home screen. What do you want it to
  be?" Write its `id` from the catalogue into `hero:`.
- Write their choices into `tiles.yml` yourself. Cap is four; fewer is fine.

### 7. Retire the empty-board guard

The template ships with a test that asserts `tiles.yml` is still empty — it protects the
template, and this repo has now outgrown it. Replace the final test in
`tests/tiles.test.mjs` (the one named `the shipped selection parses and starts empty`)
with:

```js
// Filled during onboarding: the board this owner chose has to stay valid.
test('the chosen selection parses and validates clean', async () => {
  const selection = await loadSelection()
  const catalogue = await loadCatalogue()
  assert.deepEqual(validateSelection(selection, catalogue), [])
  assert.ok(!isUnfilled(selection.hero), 'the hero was chosen in phase 10')
})
```

This is the same move `/new-agent` makes when it registers a slug in the test files: the
tests describe the repo the user actually has.

## Check

- At least two files in `workflows/` and the validator in step 4 exits clean
- Each workflow with a `schedule` has a routine in the routines list with that schedule
- At least one **Run now** produced a commit the user did not write, with the output file
  at the workflow's `output` path
- `tiles.yml` has a hero and their chosen tiles
- `node --test` passes in the repo

```bash
git add workflows/ tiles.yml tests/tiles.test.mjs .agent-team/
git commit -m "onboard: phase 10, workflows"
git push
```

## If it goes wrong

| What they saw | What to do |
|---|---|
| `step "x" is not a skill in this repo` | The skill was never built, or the name differs. List `.claude/skills/` and match, or build it. |
| `schedule ... below the 60-minute floor` | Move to `runner: github-actions`, or ask whether hourly is genuinely too slow. It usually is not. |
| `output ... must stay inside the repo` | They asked for a Desktop folder. Explain: cloud runs only see the repo. Redirect to `inbox/`. |
| The routine ran but skipped steps | The prompt did not say "each step in order". Use the prompt in step 5 verbatim. |
| `node --test` fails on tiles | Step 7 was skipped, or `tiles.yml` names a tile not in the catalogue. Run the validator's message down. |
