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
