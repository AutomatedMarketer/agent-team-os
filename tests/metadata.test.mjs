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

/* Phase 2 told the student "phase 10 checks for it" about a deferred ledger. Phase 10 did not.
   A deferral that nothing downstream reads is a skip with better paperwork — and the promise of a
   safety net is worse than no net, because it stops anyone looking for one. */

test('the phase that promises to pick up a deferred ledger actually reads it', async () => {
  const two = await read('agent-team-os/skills/onboard/phases/02-repo.md')
  const claim = /phase (\d+)\s*\n?\s*reads that line|phase (\d+)[^.]*checks for it/.exec(two)
  if (!claim) return
  const number = claim[1] ?? claim[2]
  const target = await read(`agent-team-os/skills/onboard/phases/${String(number).padStart(2, '0')}-workflows.md`)
    .catch(() => null)
  assert.ok(target, `phase 2 names phase ${number}, which could not be read`)
  // Not just the word "deferred" - the phase has to name the file the line lives in and the
  // literal line it is looking for, or it is not reading anything.
  assert.match(target, /onboarding-state\.md/,
    `phase ${number} never opens the state file, so it cannot be reading the deferral`)
  assert.match(target, /ledger: deferred/,
    `phase ${number} never looks for the \`ledger: deferred\` line phase 2 says it reads`)
})

test('every phase file agrees with the skill on how many stages there are', async () => {
  const skill = await read('agent-team-os/skills/onboard/SKILL.md')
  const stageCount = [...skill.matchAll(/^\| (\d+) · ([A-Za-z]+) \|/gm)].length
  for (const file of phaseFiles) {
    const body = await read(`agent-team-os/skills/onboard/phases/${file}`)
    for (const found of body.matchAll(/stage \d+ of (\d+)/gi)) {
      assert.equal(Number(found[1]), stageCount,
        `${file} says "${found[0]}" and the skill defines ${stageCount} stages`)
    }
  }
})

/* `/arm` says "Never arm anything not in `proposals.yml`". A proposal's `item` is an agent, a
   skill OR a workflow - and the shipped example has only `skill:triage-inbox` and `agent:content`,
   not one workflow between them. `/arm` creates one routine per WORKFLOW, using the workflow's
   own schedule. So on the taught path the student types `/arm` on Thursday night and it has
   nothing it is allowed to arm: their proposals name skills, and the two workflows they built
   that afternoon were not in a file written the previous morning.

   The bridge is real - proposals name work, `/new-workflow` turns work into a job, you arm the
   job - and it was written down nowhere. */

test('/arm explains how an approved skill or agent becomes an armable workflow', async () => {
  const arm = await read('agent-team-os/skills/arm/SKILL.md')
  // The RULE itself, not the file - the first version of this test matched `skill:` anywhere
  // in the document and stayed green when the rule went back to naming only workflows.
  const bullets = arm.split('- **Never arm anything')
  assert.ok(bullets.length > 1, 'the "never arm anything not approved" rule is gone entirely')
  const rule = bullets[1].split('- **Never arm in a batch')[0]
  assert.match(rule, /`skill:<slug>`/,
    'the rule never says an approved SKILL can make a workflow armable - and most proposals name skills')
  assert.match(rule, /`agent:<slug>`/,
    'the rule never says an approved AGENT can make a workflow armable')
  assert.match(rule, /steps:/,
    'nothing connects an approved skill to the `steps:` of the workflow that would carry it')
  assert.match(rule, /new-workflow/,
    'the rule never names the command that turns approved work into an armable job')
})

/* `new-workflow/SKILL.md` says, at one point: "Never tell them to create the routine themselves
   at `claude.ai/code`." Thirty-six lines later it says: "The routine - `claude.ai/code` ->
   Routines -> New". Students run this command twice in one session. */

test('/new-workflow does not tell them to do the thing it just forbade', async () => {
  const skill = await read('agent-team-os/skills/new-workflow/SKILL.md')
  const forbids = /Never tell them to create the routine themselves/.test(skill)
  if (!forbids) return
  const register = skill.split('## Register it')[1]
  if (!register) return
  assert.ok(!/Routines\s*(?:→|->)\s*New/.test(register),
    'the same file forbids hand-made routines and then walks them through making one')
})

/* The storefront named six of the ten commands that ship. The four it left out - /ledger,
   /match, /arm and /routines - are the four the whole 2026-08-27 pivot rests on: measure the
   week, derive the team from it, then make every job either ring or say in writing why it is
   off. A stranger reading the marketplace entry saw a plugin that scaffolds a team, with no
   sign that it measures anything first. Found by cloning the repo as a stranger, 2026-08-28. */

const commands = (await readdir(new URL('agent-team-os/skills/', root), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

test('the storefront names every command that ships, not just the memorable ones', () => {
  assert.ok(commands.length > 0, 'no skills found to check the storefront against')
  const missing = commands.filter((slug) => !marketplace.includes('/' + slug))
  assert.deepEqual(missing, [],
    'marketplace.json ships these commands without naming them: ' + missing.map((s) => '/' + s).join(', '))
})

test('the storefront does not advertise a command that does not exist', () => {
  const shipped = new Set(commands)
  // Only slash-commands, so ordinary paths and URLs in the copy are left alone.
  const advertised = [...marketplace.matchAll(/(?:^|[\s(])\/([a-z][a-z0-9-]*)/g)].map((match) => match[1])
  const phantom = [...new Set(advertised)].filter((name) => !shipped.has(name))
  assert.deepEqual(phantom, [],
    'marketplace.json advertises commands that do not ship: ' + phantom.map((s) => '/' + s).join(', '))
})

/* `/audit` told students to count unfilled brain fields with `grep -c "fill:"`. That counts
   LINES CONTAINING a match, not matches — and business-brain.md puts two markers on one row in
   the verified-claims table. So a student's audit reported 23 unfilled fields where the cockpit's
   ladder, which counts occurrences, saw 26. Two numbers for one fact about one repo, in the same
   course, on the morning the course tells them a nearly-empty report is a pass.
   Found 2026-08-28 by walking the course as a student — after making the identical mistake in the
   walkthrough log first. */

/* The first version of this test read only `skills/<slug>/SKILL.md`. Onboarding phases live in
   `skills/onboard/phases/*.md`, which it never opened - so phases 3, 4 and 5 kept telling
   students `grep -c "fill:"` for another day, and phase 4 under-reported business-brain.md as 11
   when it holds 14. A guard that checks one file per skill does not guard a skill made of many
   files. Widened 2026-08-28, walking Lesson 3 as a student. */

async function markdownUnder(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir)
    if (entry.isDirectory()) out.push(...(await markdownUnder(child)))
    else if (entry.name.endsWith('.md')) out.push(child)
  }
  return out
}

test('no skill file counts fill-markers with grep -c, which undercounts rows carrying two', async () => {
  const files = await markdownUnder(new URL('agent-team-os/skills/', root))
  const scanned = files.map((file) => decodeURIComponent(file.pathname).split('/skills/')[1])
  for (const phase of phaseFiles) {
    assert.ok(scanned.includes(`onboard/phases/${phase}`),
      `the scan missed ${phase} - this test exists because it used to miss every phase file`)
  }

  const offenders = []
  for (const [index, file] of files.entries()) {
    const body = await readFile(file, 'utf8')
    // grep -c anywhere on a line that also mentions the fill marker
    for (const [lineNumber, line] of body.split(/\r?\n/).entries()) {
      if (/grep\s+(-\w*\s+)*-\w*c/.test(line) && /fill:/.test(line)) {
        offenders.push(`skills/${scanned[index]}:${lineNumber + 1}: ${line.trim()}`)
      }
    }
  }

  assert.deepEqual(offenders, [],
    'these count fill-markers by line, so they undercount and disagree with the dashboard:\n  ' +
    offenders.join('\n  '))
})
