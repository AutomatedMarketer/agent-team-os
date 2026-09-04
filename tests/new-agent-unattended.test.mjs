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
  // Review reversed the rule - "Leave `for:` out is the old rule; ignore it and always set
  // for:" - and the substring check stayed green. The instruction has to be the bold opening
  // of its own line, with nothing in that line turning it around.
  const forLine = unattended.split(/\r?\n/).find((line) => /\*\*Leave `for:` out/.test(line)) ?? ''
  assert.ok(/^\s*\*\*Leave `for:` out/.test(forLine),
    'the instruction to leave for: off the card is not the bold opening of its own line - it has been demoted to a mention')
  assert.doesNotMatch(forLine, /ignore|old rule|instead|always set|include it|put it in/i,
    'the line that says to leave for: out goes on to say the opposite')
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
  // Review wrote "Never guess sonnet ... always use opus instead" and the old check passed,
  // because it only asked whether sonnet and guess shared a sentence. The fallback has to be an
  // ordered phrase - the verb, then sonnet - with no negation or rival model in front of it.
  const sentence = /[^.]*`sonnet`[^.]*\./i.exec(unattended)?.[0] ?? ''
  assert.match(sentence, /\b(guess|default to|fall back to|choose)\b[^.]{0,12}`sonnet`/i,
    'sonnet is mentioned but not as the thing to fall back to - the verb has to come first and point at it')
  assert.doesNotMatch(sentence, /\b(never|not|don\S*t|instead|opus)\b[^.]*`sonnet`/i,
    'the sentence naming sonnet as the fallback is turned around before it gets there')
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

/* What the end-to-end simulations found on 2026-09-04, when fresh sessions were handed the exact
   payloads the two buttons send. Adding any skill or agent to the template fails npm test as
   shipped, because the README counts them and a test checks it - so "commit nothing if the checks
   fail", read literally, means the buttons can never succeed. Nothing said whether a successful
   unattended build writes a run log; run-facts.mjs only accepts agent slugs, and the session is
   not an agent. And /new-agent's register list named five places when a ninth agent breaks eight.
   Both siblings now settle all of it, and these keep them settled. */

const unattendedOf = async (path) => (await read(path)).split(/\n##+ [^\n]*[Uu]nattended[^\n]*\n/)[1] ?? ''

for (const [name, path] of [
  ['new-agent', 'agent-team-os/skills/new-agent/SKILL.md'],
  ['new-skill', 'agent-team-os/skills/new-skill/SKILL.md']
]) {
  test(`${name}'s unattended path says a stale count is bookkeeping, not the build failing`, async () => {
    const body = await unattendedOf(path)
    assert.match(body, /README\.md/, 'it never names the file that carries the count')
    assert.match(body, /bookkeeping/i, 'it never says a stale count is bookkeeping rather than the build failing')
    assert.match(body, /[Uu]pdate the count/, 'it never says to update the count')
  })

  test(`${name}'s unattended path says what the record of a successful build is`, async () => {
    const body = await unattendedOf(path)
    const sentence = /[^.]*run log[^.]*successful[^.]*\./i.exec(body)?.[0] ?? ''
    assert.ok(sentence, 'nothing says whether a successful build writes a run log, so every session decides differently')
    assert.match(sentence, /don\S*t|do not|no run log/i, 'it says to write one, but run-facts.mjs cannot - the session is not an agent')
    assert.match(body, /card[^.]*is the\s+record|record[^.]*card/i, 'it never says the review card is the record instead')
  })
}

test('/new-agent names every list a ninth agent breaks, not just the five it shipped with', async () => {
  const register = (await read('agent-team-os/skills/new-agent/SKILL.md')).split('## Register it')[1]?.split('\n## ')[0] ?? ''
  assert.ok(register, 'the Register it section is gone')
  for (const list of ['tests/agents.test.mjs', 'tests/orchestrator.test.mjs', 'tests/routing.test.mjs', 'tests/commit-override.test.mjs']) {
    assert.ok(register.includes(list), `${list} pins a list a new agent has to join, and Register it never names it`)
  }
  for (const counted of ['CLAUDE.md', 'routing.md', 'README.md']) {
    assert.ok(register.includes(counted), `${counted} counts the team in words and Register it never says to move it`)
  }
  assert.match(register, /draft-only\.md|safety\.test\.mjs/, 'an agent that reaches the outside world belongs on the safety list, and nothing says so')
})
