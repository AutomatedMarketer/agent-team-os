import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

/* The plugin's own storefront copy is the first thing anybody reads and the last thing anybody
   checks. `marketplace.json` said "eleven resumable phases across five stages" - twice - against
   twelve phase files and six named stages. `plugin.json` said twelve phases across five stages
   and then listed five of the six by name. All three disagreed with each other and with the
   folder they describe, in the text a stranger reads BEFORE deciding to install anything.

   The counts come from the repo now. Adding a phase makes these fail until the copy catches up,
   which is the only arrangement that has ever kept a number honest around here. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const phaseFiles = (await readdir(new URL('agent-team-os/skills/onboard/phases/', root)))
  .filter((name) => /^\d\d-.+\.md$/.test(name))

const skill = await read('agent-team-os/skills/onboard/SKILL.md')
const marketplace = await read('.claude-plugin/marketplace.json')
const plugin = await read('agent-team-os/.claude-plugin/plugin.json')
const readme = await read('README.md')

// The stage table in SKILL.md is the source of truth for what a stage is: numbered rows, each
// with a name and a plain-English "done when".
const stages = [...skill.matchAll(/^\| (\d+) · ([A-Za-z]+) \|/gm)].map((row) => row[2])

const WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 11: 'eleven', 12: 'twelve' }
const word = (count) => WORDS[count] ?? String(count)

test('there is a phase file for every phase, numbered without gaps', () => {
  assert.ok(phaseFiles.length > 0, 'no phase files at all')
  const numbers = phaseFiles.map((name) => Number(name.slice(0, 2))).sort((a, b) => a - b)
  assert.deepEqual(numbers, Array.from({ length: numbers.length }, (unused, index) => index + 1),
    `phase files are numbered ${numbers.join(', ')} - somebody added or removed one without renumbering`)
})

test('the skill says how many phases and stages it actually has', () => {
  assert.ok(skill.includes(`${word(phaseFiles.length)} resumable phases`) ||
            skill.includes(`${word(phaseFiles.length)} phases`),
    `there are ${phaseFiles.length} phase files and SKILL.md does not say so`)
  assert.ok(skill.includes(`${word(stages.length)} stages`),
    `the stage table has ${stages.length} rows and SKILL.md does not say so`)
})

test('the storefront copy agrees with the folder it is describing', () => {
  const phases = word(phaseFiles.length)
  const stageCount = word(stages.length)
  for (const [label, text] of [['marketplace.json', marketplace], ['plugin.json', plugin]]) {
    const wrongPhases = new RegExp(`(eleven|twelve|ten|thirteen)([- ])(resumable )?phase`, 'gi')
    for (const found of text.matchAll(wrongPhases)) {
      assert.equal(found[1].toLowerCase(), phases,
        `${label} advertises "${found[0]}" and there are ${phaseFiles.length} phase files`)
    }
    for (const found of text.matchAll(/(four|five|six|seven) stages/gi)) {
      assert.equal(found[1].toLowerCase(), stageCount,
        `${label} advertises "${found[0]}" and the skill defines ${stages.length}`)
    }
  }
})

test('any stage list in the storefront copy names every stage, not most of them', () => {
  for (const [label, text] of [['marketplace.json', marketplace], ['plugin.json', plugin]]) {
    const named = stages.filter((stage) => text.includes(stage))
    // One match is a coincidence, not a list - "Monday Brief" is not the Brief stage. Two or
    // more is somebody enumerating the stages, and then it has to be all of them.
    if (named.length < 2) continue
    assert.deepEqual(named, stages,
      `${label} lists stages by name and leaves out ${stages.filter((s) => !named.includes(s)).join(', ')}`)
  }
})

/* "Two of them shell out to a script for arithmetic that deserves tests" - and then named one.
   There is one script in this repo. The other command it was thinking of shells out to a script
   in the TEMPLATE repo, which is a different repo and a different sentence. */

test('the README counts the scripts that are actually in this repo', async () => {
  const walk = async (dir) => {
    const entries = await readdir(new URL(dir, root), { withFileTypes: true })
    const found = []
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === 'tests' || entry.name.startsWith('.')) continue
      if (entry.isDirectory()) found.push(...await walk(`${dir}${entry.name}/`))
      else if (entry.name.endsWith('.mjs')) found.push(`${dir}${entry.name}`)
    }
    return found
  }
  const scripts = await walk('agent-team-os/')
  const claim = /\b(One|Two|Three|Four) of them shell(s?) out to a script/.exec(readme)
  assert.ok(claim, 'the README no longer says how many commands shell out to a script')
  assert.equal(claim[1].toLowerCase(), word(scripts.length),
    `the README says ${claim[1].toLowerCase()} and this repo ships ${scripts.length}: ${scripts.join(', ')}`)
})

/* The README told a reader to run `npm test` and expect 28 tests, in two separate places. The
   same sentence in the template repo said 332 against a suite of 339, and was wrong for exactly
   the same reason: nothing was checking it. So this checks it — by running the suite. */

test('the README quotes the number of tests the suite actually reports', () => {
  if (process.env.AGENT_TEAM_OS_README_SELF_CHECK === '1') return

  // NODE_TEST_CONTEXT is set for us by the runner; passing it down makes the child report in
  // v8-serialized frames to a parent that is not listening, and there is no summary to read.
  const env = { ...process.env, AGENT_TEAM_OS_README_SELF_CHECK: '1' }
  delete env.NODE_TEST_CONTEXT
  const run = spawnSync(process.execPath, ['--test'], {
    cwd: fileURLToPath(root),
    encoding: 'utf8',
    env
  })
  const reported = /^\s*(?:ℹ|#)\s*pass\s+(\d+)\s*$/m.exec(run.stdout ?? '')
  assert.ok(reported, "could not read a pass count out of the suite's own output")

  const claims = [...readme.matchAll(/(\d+) tests/g)].map((found) => found[1])
  assert.ok(claims.length, 'the README no longer says how many tests there are')
  for (const claimed of claims) {
    assert.equal(claimed, reported[1],
      `the README says ${claimed} tests and the suite reports ${reported[1]}`)
  }
})

/* `/new-workflow` is the command a student is taught to build jobs with, and its template is the
   only YAML most of them will ever see. It wrote a `trigger:` block with `schedule:` and
   `fire: true` and **no `armed:` and no `reason:`** — while citing `workflows/README.md` as the
   contract it matches. That contract says, in as many words, that `npm run check:arming` refuses
   a file without them. Verified: dropping that exact file into a fresh template clone produces
   "Monday Brief: is not armed and carries no reason".

   So the first job a student ever builds broke the repo's own check, and if they then scheduled
   it in a browser — which the Day 2 homework asks for — it became UNAPPROVED: a routine ringing
   that the file says is off. That is the one state the whole course calls "the one that costs
   money", manufactured by following the instructions. */

test('the workflow template /new-workflow writes satisfies the contract it cites', async () => {
  const skill = await read('agent-team-os/skills/new-workflow/SKILL.md')
  const yaml = /```yaml\n([\s\S]*?)```/.exec(skill)
  assert.ok(yaml, '/new-workflow no longer shows the file it writes')
  const trigger = yaml[1].split('trigger:')[1]?.split('\noutput:')[0] ?? ''
  assert.match(trigger, /armed:/, 'the trigger block it writes has no `armed:` - check:arming refuses the file')
  assert.match(trigger, /reason:/, 'the trigger block it writes has no `reason:` - check:arming refuses the file')
  assert.match(trigger, /armed:\s*false/,
    'a job must not arm itself by existing - `armed: true` is set by /arm, after a routine is confirmed')
})

test('/new-workflow tells the student not to schedule it by hand', async () => {
  const skill = await read('agent-team-os/skills/new-workflow/SKILL.md')
  assert.match(skill, /\/arm/,
    'nothing here points at /arm, so the student is left to create the routine in a browser - which is exactly how a job becomes UNAPPROVED')
})

/* The pre-work tells a student to decline `/ledger` because the ledger is measured live in the
   room, with somebody asking the second question - the course's stated single most important
   safeguard. Phase 2 then says "Do not continue to phase 3 until `npm run check:ledger` exits
   clean". Those cannot both be followed. A student doing the pre-work as instructed stalls at
   phase 2 with no way forward and no explanation.

   Phase 2 needs a path for "I am measuring this in a workshop on Wednesday" that is not a
   deadlock and is not a silent skip. */

test('phase 2 has a deferral path for a ledger that is being measured elsewhere', async () => {
  const phase = await read('agent-team-os/skills/onboard/phases/02-repo.md')
  assert.match(phase, /defer/i,
    'phase 2 offers no way to say "I am measuring my week in the workshop", so the pre-work deadlocks here')
  assert.match(phase, /\.agent-team\/onboarding-state\.md|onboarding-state/,
    'a deferral that is not written down is a skip - phase 3 would never know it happened')
})

test('the phase 2 gate admits a deferred ledger, rather than only a clean one', async () => {
  const phase = await read('agent-team-os/skills/onboard/phases/02-repo.md')
  const gate = /Do not continue to phase 3[^.]*\./.exec(phase)
  assert.ok(gate, 'the phase 3 gate sentence is gone entirely - it should still be a gate')
  assert.match(gate[0], /defer/i,
    `the gate still admits only a clean ledger: "${gate[0]}"`)
})

/* There are TWO gates in that file, and the first version of this test only read one of them.
   The prose said "or the ledger has been deliberately deferred"; the `## Check` block below it
   still demanded a clean `check:ledger`, and `onboard/SKILL.md` says a phase that did not pass
   its check does not advance. So the deferral was written, tested, green, and still blocked -
   by the half of the file nobody looked at. Reading one of two gates is how a half-fix passes. */

test('the phase 2 CHECK block admits a deferred ledger too, not just the prose above it', async () => {
  const phase = await read('agent-team-os/skills/onboard/phases/02-repo.md')
  const check = phase.split('## Check')[1]
  assert.ok(check, 'phase 2 has no Check block at all')
  if (/check:ledger/.test(check)) {
    assert.match(check, /defer/i,
      'the Check block still passes only on a clean ledger, so a deferring student cannot advance')
  }
})
