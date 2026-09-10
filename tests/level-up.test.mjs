import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

/* `/level-up` was ported from the Co-Work plugin on 2026-09-10, where its whole value is that it
   asks five questions and answers with ONE move naming a command that exists. Ported wholesale,
   it would have handed off to /add-skill and /browse-connectors - commands this plugin has never
   shipped. And the Brief phases now point a student at `/level-up` when a vague answer is let
   through, so the command those phases promise has to be real. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const skill = await read('agent-team-os/skills/level-up/SKILL.md')
const commands = (await readdir(new URL('agent-team-os/skills/', root), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

test('/level-up asks exactly five numbered questions, each a quoted line', () => {
  const section = skill.split('## The five questions')[1]?.split('## How to pick')[0] ?? ''
  // A question wraps across lines, so split on the numbered items rather than on lines.
  const items = section.split(/\r?\n(?=\d\.\s+\*\*)/).filter((chunk) => /^\d\.\s+\*\*/.test(chunk))
  assert.equal(items.length, 5, `expected five questions, found ${items.length}`)
  for (const item of items) {
    assert.match(item, /"[^"]+\?"/s, `question is not a quoted question: ${item.split('\n')[0]}`)
  }
})

test('/level-up only hands off to commands this plugin actually ships', () => {
  const shipped = new Set(commands)
  const advertised = [...skill.matchAll(/`\/([a-z][a-z0-9-]*)`/g)].map((match) => match[1])
  const phantom = [...new Set(advertised)].filter((name) => !shipped.has(name))
  assert.deepEqual(phantom, [],
    'level-up recommends commands that do not ship here: ' + phantom.map((s) => '/' + s).join(', '))
})

test('/level-up recommends one move and writes it to the team repo, not the laptop', () => {
  assert.match(skill, /\*\*One recommendation\.\*\*/, 'the one-move rule is gone')
  assert.match(skill, /\.agent-team\/level-up-log\.md/, 'nothing says where the recommendation is logged')
  assert.match(skill, /Nothing goes in `~\/\.claude\/`/, 'nothing forbids logging to the laptop')
  assert.match(skill, /Never arm anything yourself/, 'level-up could switch a job on without /arm')
})

test('every Brief phase that promises /level-up will catch a thin field points at a command that exists', async () => {
  for (const file of ['03-about-me.md', '04-business-brain.md', '05-writing-rules.md']) {
    const body = await read(`agent-team-os/skills/onboard/phases/${file}`)
    assert.match(body, /## Do not let a vague answer through/, `${file} has no vague-answer gate`)
    assert.match(body, /`\/level-up`/, `${file} lets a thin field through without naming what will catch it`)
  }
  assert.ok(commands.includes('level-up'), 'the phases name /level-up and it does not ship')
})
