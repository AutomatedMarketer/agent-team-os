import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/* Phase 11 is the one place a student types real secrets into real dashboards, so it is the one
   phase whose text is checked line by line. These tests pin what a student must be able to rely
   on: the question is asked, both paths exist, the website path uses the board's CURRENT setting
   names and shapes, no private names leak, and no example looks like a real secret.

   The old phase told students a setup the board now refuses: no sign-in, no voice, and
   FIRE_TRIGGERS as plain links. */

const root = new URL('../', import.meta.url)
const pluginDir = fileURLToPath(new URL('agent-team-os/', root))
const phase = await readFile(new URL('agent-team-os/skills/onboard/phases/11-oversight.md', root), 'utf8')
const skill = await readFile(new URL('agent-team-os/skills/onboard/SKILL.md', root), 'utf8')

async function allFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...await allFiles(path))
    else found.push(path)
  }
  return found
}

const section = (heading) => {
  const start = phase.indexOf(heading)
  assert.ok(start >= 0, `phase 11 has no section "${heading}"`)
  const next = phase.indexOf('\n## ', start + heading.length)
  return phase.slice(start, next === -1 ? undefined : next)
}

test('the phase asks the question and names both answers in plain words', () => {
  const question = section('## The question')
  assert.ok(question.includes('**On my computer**'), 'the question must offer "On my computer"')
  assert.ok(question.includes('**Website**'), 'the question must offer "Website"')
  assert.ok(phase.indexOf('## The question') < phase.indexOf('## Path A'), 'the question comes before Path A')
  assert.ok(phase.indexOf('## The question') < phase.indexOf('## Path B'), 'the question comes before Path B')
})

test('the choice is recorded in the state file either way', () => {
  assert.ok(phase.includes('board: this-computer'))
  assert.ok(phase.includes('board: website'))
})

test('one switch line decides whether the on-my-computer board can be offered', () => {
  const switches = phase.match(/^board-this-computer: (coming-soon|ready)$/gm) ?? []
  assert.equal(switches.length, 1, 'there must be exactly one board-this-computer line')
  assert.ok(/coming soon,\s+not built\s+yet/.test(phase), 'the unbuilt state must be said plainly')
  assert.ok(/offer two things: set up the website board now, or pause/i.test(phase),
    'when the switch is coming-soon the website board must still be offered')
})

test('Path A has its nine steps in order, with the unbuilt ones marked, with the starter and folder names the plan uses', () => {
  const pathA = section('## Path A')
  const steps = [...pathA.matchAll(/^### A(\d+)\./gm)].map((match) => Number(match[1]))
  assert.deepEqual(steps, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  assert.ok(pathA.includes('Giving it an order.'), 'the order half of A8 must be there')
  assert.ok(!pathA.includes('NOT BUILT YET'), 'every step of Path A exists now')
  // The board shows "Jobs are off: the runner code is not installed" without runner-code, and runs no job until the self-test passes.
  assert.ok(pathA.includes('runner-code') && pathA.includes('--selftest'), 'Path A must install the runner code and run the self-test')
  assert.ok(pathA.includes('--state-dir') && pathA.includes('--work-dir') && pathA.includes('--env-file'), 'the self-test needs the three places')
  assert.ok(pathA.includes(String.raw`& "C:\path\to\board\Start Board.bat"`), 'the exact quoted-path start command is missing')
  assert.ok(!/within 5 minutes|Check my setup/.test(pathA), 'Path A promises something the board does not do')
  assert.ok(!/Voice Studio|Ollama/.test(pathA), 'the course path never teaches local voice')
  assert.ok(pathA.includes('board.json'), 'Path A must write board.json')
  assert.ok(!/private copy|ANTHROPIC_API_KEY/.test(pathA), 'Path A mentions a runner that does not exist')
  for (const name of ['Start Board.command', 'Start Board.bat', 'the board folder']) {
    assert.ok(pathA.includes(name), `Path A never names "${name}"`)
  }
})

test('Path B names every setting the current board reads, with the right shape', () => {
  const pathB = section('## Path B')
  for (const name of ['GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_TOKEN', 'VIEW_KEY', 'BOARD_USERNAME',
    'BOARD_PASSWORD', 'OPENAI_API_KEY', 'FIRE_KEY', 'FIRE_TRIGGERS']) {
    assert.ok(pathB.includes(`\`${name}\``), `Path B never names ${name}`)
  }
  assert.ok(/12 characters or more/.test(pathB), 'the password length rule is missing')
  assert.ok(pathB.includes('task-intake'), 'task-intake must be in FIRE_TRIGGERS or buttons fail')
  assert.ok(/Vercel Authentication/.test(pathB) && /Rate Limit/.test(pathB), 'the two lock steps are missing')
  assert.ok(/hard-limit enforcement/.test(pathB), 'the OpenAI hard spend limit step is missing')
})

test('every FIRE_TRIGGERS example is slug -> {url, token}, never a bare link', () => {
  const blocks = [...phase.matchAll(/```json\n([\s\S]*?)```/g)].map((match) => match[1])
  assert.ok(blocks.length > 0, 'no FIRE_TRIGGERS example at all')
  for (const block of blocks) {
    const parsed = JSON.parse(block)
    for (const [slug, value] of Object.entries(parsed)) {
      assert.equal(typeof value, 'object', `"${slug}" is a plain value - the board refuses that old shape`)
      assert.equal(typeof value.url, 'string', `"${slug}" has no url`)
      assert.equal(typeof value.token, 'string', `"${slug}" has no token`)
    }
  }
})

test('no example looks like a real secret, and the chat is kept clear of them', () => {
  for (const shape of [/sk-[A-Za-z0-9_-]{8,}/, /trig_[A-Za-z0-9]{6,}/, /ghp_[A-Za-z0-9]{10,}/,
    /github_pat_[A-Za-z0-9_]{10,}/, /api\.anthropic\.com\/v1\/claude_code/]) {
    assert.ok(!shape.test(phase), `phase 11 contains something shaped like a real secret: ${shape}`)
  }
  assert.ok(/Never ask them to paste a key, password, token or trigger link into this chat/.test(phase))
  assert.ok(/do not repeat the\s+value back/.test(phase))
})

test("Nuno's private names never reach a student", async () => {
  const banned = [/local\.donna/i, /\bMac Mini\b/i, /\bdonna\b/i, /\bHermes cron\b/i]
  for (const file of await allFiles(pluginDir)) {
    if (!/\.(md|json|mjs)$/.test(file)) continue
    const text = await readFile(file, 'utf8')
    for (const pattern of banned) {
      assert.ok(!pattern.test(text), `${file} contains ${pattern}`)
    }
  }
})

test('the old setup is gone: no always-on question on the computer path, no PUBLIC_FIRE advice', () => {
  assert.ok(/Skip it entirely on Path A/.test(phase))
  assert.ok(/Do not set\s+`PUBLIC_FIRE`/.test(phase))
})

test('the skill file tells the same story as the phase', () => {
  const row = skill.split('\n').find((line) => line.startsWith('| 11 | Oversight'))
  assert.ok(row, 'no phase 11 row in the SKILL.md table')
  assert.ok(/computer/i.test(row) && /website/i.test(row), 'the phase 11 row must mention both choices')
  assert.ok(!/Deploy the dashboard, wire the buttons, phone bookmark/.test(skill), 'the old one-path row is still there')
})
