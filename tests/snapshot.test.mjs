import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* /snapshot runs a collector that reads usage numbers from the person's own computer, which sits
   right next to the files that hold their login. The skill is read by students and followed by a
   model, so the "never open those files" rule has to be written down in the skill itself, in
   words, not assumed. Same for "do not get around the safety gate": a model that is told to
   "make it work" will otherwise try. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const snapshot = await read('agent-team-os/skills/snapshot/SKILL.md')
const phase = await read('agent-team-os/skills/onboard/phases/11-oversight.md')

test('/snapshot has the same frontmatter shape as the other commands', () => {
  assert.match(snapshot, /^---\nname: snapshot\ndescription: .+\/snapshot.+\n---\n/s)
})

test('/snapshot runs the collector with the computer label and commits only its own paths', () => {
  assert.match(snapshot, /node scripts\/collect-status\.mjs --computer "[^"]+" --commit/)
  assert.match(snapshot, /team repo root/i)
  assert.match(snapshot, /only its own (paths|files)/i)
})

test('/snapshot forbids opening the credentials files, and names every one', () => {
  assert.match(snapshot, /never (open|read)[^.]*credentials/i)
  for (const secret of ['~/.claude/.credentials.json', '~/.claude.json', '~/.codex/auth.json', 'Keychain']) {
    assert.ok(snapshot.includes(secret), `the skill never names ${secret} as off limits`)
  }
})

test('/snapshot stops at the safety gate instead of working around it', () => {
  assert.match(snapshot, /refuses/i)
  assert.match(snapshot, /name[sd]? the field|field it named/i)
  assert.match(snapshot, /never (work|get) around/i)
})

test('/snapshot reads back plan names, percentages, reset times and missing sources', () => {
  for (const word of [/plan/i, /percent/i, /reset/i, /not found/i]) {
    assert.match(snapshot, word)
  }
})

test('phase 11 asks which computer is always on, one question at a time', () => {
  assert.match(phase, /one at a time/i)
  assert.match(phase, /always on/i)
  assert.match(phase, /\/snapshot/)
  assert.match(phase, /\.agent-team\/status\/README\.md/)
})

test('phase 11 asks what they pay each month and writes it under subscriptions:', () => {
  assert.match(phase, /each month/i)
  assert.match(phase, /subscriptions:/)
  for (const key of ['name', 'service', 'price', 'currency', 'per']) {
    assert.ok(phase.includes(key), `the subscription entry never mentions ${key}`)
  }
  assert.match(phase, /do not hand-edit|not to hand-edit|exception/i,
    'stack.yml says not to hand-edit; the phase must say why writing it here is allowed')
})

test('phase 11 does not ask for the Claude plan again - phase 1 has it', () => {
  assert.match(phase, /phase 1/i)
  assert.ok(!/which (claude )?plan are you on/i.test(phase))
})

// The collector only pushes from a person's own copy when the push would carry the snapshot
// alone, to the default branch. The skill must not promise more than that, and must tell the
// person what to do when it commits without pushing.
test('/snapshot says when it will not push, and that it tells them why', () => {
  assert.match(snapshot, /other (commits|work)[^.]*not (yet )?pushed|unpushed/i)
  assert.match(snapshot, /another branch|not on (the )?(main|default) branch/i)
  assert.match(snapshot, /(commits|saves) the snapshot[^.]*(but )?(does not|doesn't|won't) push/i)
  assert.match(snapshot, /says why|tells them why|tell them (what|why)/i)
  // The old promise said nothing about pushing at all, while the script pushed everything.
  assert.match(snapshot, /pushes only the snapshot|push(es)? (it )?only when/i)
})
