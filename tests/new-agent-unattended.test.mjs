import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

/* /new-agent and /new-skill are siblings. Both are written as interviews - /new-agent asks four
   questions one at a time - and both are now reached from a dashboard button that dispatches one
   sentence into a session with nobody in front of it. /new-skill got a section for that on
   2026-09-03. /new-agent did not, so the two disagreed about what to do when nobody is there, and
   the only thing covering the gap was the dashboard's own instruction text.

   These pin the same shape /new-skill's tests pin, so the two cannot drift apart again. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const skill = await read('agent-team-os/skills/new-agent/SKILL.md')
const unattended = skill.split(/\n##+ [^\n]*[Uu]nattended[^\n]*\n/)[1] ?? ''

test('/new-agent has a path for being run unattended from one sentence', () => {
  assert.ok(unattended,
    'no unattended section - the Add agent button dispatches into a session with nobody to answer the four questions')
  assert.ok(/guess|assum|infer|work (the answers |them )?out/i.test(unattended),
    'an unattended run answers the four questions itself; the section has to say to write down what it decided')
  assert.match(unattended, /tasks\//,
    'the guesses have to land somewhere the owner will see them - a card in tasks/')
})

test('the review card is written so the task sweep hands it back rather than working it', () => {
  assert.match(unattended, /open the body with this line:\*\*\s*\n\s*\n\s*> This one needs you, not an agent/,
    'the line is not given as the instruction "open the body with this line", followed by the line itself')
  assert.ok(/[Ll]eave `for:` out/.test(unattended),
    'nothing plainly says to leave `for:` off the review card - and a card with no for: is routed and worked by the sweep')
  assert.ok(/work-the-tasks|task sweep|sweep/i.test(unattended),
    'it never names the sweep that would otherwise pick the card up')
})

test('an unattended run does not leave the agent switched on', () => {
  assert.ok(/not arm|never arm|arm nothing|arms nothing|do not arm|nothing is armed/i.test(unattended),
    'the unattended path never says it leaves the agent unarmed, and unattended plus armed is the expensive combination')
  assert.ok(/proposals\.yml/.test(unattended),
    'it never says to leave proposals.yml alone, and an agent that writes its own proposal has approved itself')
  assert.ok(/workflow|routine|schedul/i.test(unattended),
    'nothing says no workflow and no routine come out of this')
})

/* The interview's second question decides the model. Unattended, that answer is a guess, and a
   guess should land on the cheaper, more literal one - the same rule the interview gives for
   anything that touches a customer. */

test('when it has to guess the model, it guesses sonnet', () => {
  assert.match(unattended, /sonnet/i,
    'the section never says which model to fall back to, so an unattended run picks by taste')
  const sentence = /[^.]*sonnet[^.]*\./i.exec(unattended)?.[0] ?? ''
  assert.ok(/guess|unsure|cannot tell|can\S*t tell|doubt|default/i.test(sentence),
    'sonnet is mentioned but not as the thing to fall back to when the sentence does not say how often it runs')
})

test('the unattended path still runs every check the interview path runs', () => {
  for (const check of ['sync-prompt-blocks', 'build-model-card', 'prompt-audit', 'npm test']) {
    assert.ok(unattended.includes(check),
      `the unattended path skips ${check}, which the interview path requires - an agent that skipped it would fail the suite it was never run against`)
  }
})

/* Both siblings now carry the same section. If one is edited and the other is not, the sweep
   below says so - it is the whole reason these tests exist. */

test('the two siblings agree on what the review card looks like', async () => {
  const sibling = await read('agent-team-os/skills/new-skill/SKILL.md')
  const other = sibling.split(/\n##+ [^\n]*[Uu]nattended[^\n]*\n/)[1] ?? ''
  for (const shared of [
    'tasks/YYYY-MM-DD-review-<slug>.md',
    'This one needs you, not an agent',
    'Leave `for:` out'
  ]) {
    assert.ok(unattended.includes(shared) && other.includes(shared),
      `"${shared}" is in one sibling's unattended section and not the other - they have drifted`)
  }
})
