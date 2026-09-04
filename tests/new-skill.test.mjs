import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

/* There was no skill-creating command anywhere. Not in this plugin, not in the template, not in
   the course. `/new-agent` adds a specialist and `/new-workflow` adds a job, and between them sat
   the one thing the catalogue is mostly made of - 25 skills in the shipped template - with no way
   to add a 26th except by copying a folder and hoping.

   That gap became visible when the dashboard grew an "Add skill" button, which had nothing to
   hand the work to. These tests pin the command to the contract the TEMPLATE repo enforces, so a
   skill written by following this command passes `npm test` over there rather than here. */

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

const skill = await read('agent-team-os/skills/new-skill/SKILL.md').catch(() => null)

test('/new-skill ships as a command', () => {
  assert.ok(skill, 'agent-team-os/skills/new-skill/SKILL.md does not exist')
})

test('its own frontmatter matches the folder it lives in', () => {
  assert.match(skill, /^---\n(?:[\s\S]*?\n)?name: new-skill\n/, 'frontmatter name must be new-skill')
  const description = /\ndescription: (.+)/.exec(skill)
  assert.ok(description && description[1].length > 20, 'it needs a real one-line description')
})

/* The file it tells a student to write is checked by three tests in the template repo:
   frontmatter `name` must equal the folder, `description` must be over 20 characters, and the
   whole file must pass the prompt audit. If the example here does not satisfy them, following
   this command produces a repo whose own suite is red. */

const example = /```markdown\n([\s\S]*?)```/.exec(skill ?? '')

test('the example file it writes carries the frontmatter the template checks for', () => {
  assert.ok(example, '/new-skill no longer shows the file it writes')
  const body = example[1]
  assert.match(body, /^---\n/, 'the example has no frontmatter block at all')
  assert.match(body, /\nname: /, 'no `name:` - the template asserts it equals the folder name')
  assert.match(body, /\ndescription: /, 'no `description:` - the template requires one over 20 characters')
  assert.match(body, /\naudience: /, 'no `audience:` - the field that decides whether /match can offer it')
})

/* `audience` was the defect a reject-reviewer found on 2026-09-03, and the test above could not
   see it: it asked whether the KEY was present, never what the value was. The example was
   owner-facing business work carrying `audience: team`, and in agent-team-template
   `proposable()` reads `item.audience !== 'team'` - so a student following this command to the
   letter would write a real, working, fully green skill that `/match` can never offer them, with
   nothing anywhere saying why. Silent, and green.

   The shipped near-twin, `.claude/skills/draft-chase-messages/SKILL.md`, carries no audience at
   all, which defaults to owner. These two tests check the value and the explanation, not the key. */

test('the example is owner-facing work and is not marked as team tooling', () => {
  const audience = /\naudience: (\S+)/.exec(example?.[1] ?? '')
  assert.ok(audience, 'the example has no audience value to read')
  assert.notEqual(audience[1], 'team',
    'the example drafts chase messages - that is the owner\'s own week, and `team` makes it unproposable by /match forever')
  assert.equal(audience[1], 'owner', `the example says audience: ${audience[1]}, which is neither owner nor team`)
})

test('it explains what audience actually decides, rather than who runs the skill', () => {
  assert.ok(/audience: team/.test(skill) && /audience: owner/.test(skill),
    'it never shows both values, so a writer has nothing to choose between')
  const section = /\n## [^\n]*`?audience`?[^\n]*\n([\s\S]*?)\n## /i.exec(skill)
  assert.ok(section, 'there is no section explaining audience - it is one word that decides proposability')
  assert.ok(/never (be )?propose|cannot (ever )?be proposed|can never propose|not be offered|never be offered/i.test(section[1]),
    'the section never says that `team` means /match will never propose it, which is the entire consequence')
  assert.ok(/silent|nothing tells|no.{0,20}warning|green/i.test(section[1]),
    'it never says the failure is silent - a writer who thinks a wrong value would be caught will not check it')
})

test('it says the frontmatter name has to equal the folder name', () => {
  assert.ok(/name.{0,120}folder|folder.{0,120}name/is.test(skill),
    'nothing here says the `name:` and the folder must match, and the template asserts they do')
})

/* The template bans three shell-specific commands in skills, because most students are on
   Windows and PowerShell is the default shell. A command that teaches skill-writing has to carry
   that rule forward or it teaches the bug. */

/* The first version of this test asked only whether the word "PowerShell" appeared anywhere in
   the file. Deleting the sentence that names the three banned commands left it green - it was
   measuring a word, not the rule. It now names the three the template's own suite refuses. */

test('it carries the PowerShell rule the template enforces', () => {
  assert.ok(/powershell/i.test(skill),
    'nothing warns that a bash-only command in a skill fails for most students, and the template refuses those files')
  for (const banned of ['date -u', 'echo "$VAR"', 'export NAME=value']) {
    assert.ok(skill.includes(banned),
      `the template's suite refuses a skill containing \`${banned}\` and this command never names it`)
  }
})

test('the example it writes is not itself bash-only', () => {
  const body = example?.[1] ?? ''
  assert.doesNotMatch(body, /^\s*date\s+-u\b/m)
  assert.doesNotMatch(body, /^\s*echo\s+"\$[A-Z_]+"/m)
  assert.doesNotMatch(body, /^\s*export\s+[A-Z_]+=/m)
})

/* The prompt auditor rejects a fixed list of phrasings. `/new-agent` reprints that list so the
   writer never has to discover it by failing. A sibling command that leaves it out sends people
   to the same wall. */

test('it reprints the language the prompt auditor rejects', () => {
  for (const banned of ['CRITICAL', 'Verify your work']) {
    assert.ok(skill.includes(banned),
      `the audit rejects "${banned}" and this command never mentions it`)
  }
  assert.match(skill, /prompt.audit/i, 'it never names the check that will reject the file')
})

/* A skill is a capability, not a job. Nothing about writing one puts it on a schedule, and the
   course's most expensive failure is a routine ringing that nobody approved. `/new-workflow`
   already had to be taught this lesson; this command inherits it. */

test('it says writing a skill does not schedule anything', () => {
  assert.match(skill, /new-workflow/,
    'nothing points at the command that turns a skill into a job, so the student is left to schedule it by hand')
  assert.ok(/not a job|nothing is scheduled|schedules nothing|does not schedule/i.test(skill),
    'it never says that adding a skill schedules nothing - which is how a student ends up arming it')
})

test('it names the check that has to pass before the commit', () => {
  const check = skill.split('## Check')[1]
  assert.ok(check, 'there is no Check section')
  assert.match(check, /npm test/, 'the Check section never runs the suite that would reject the file')
})

/* The dashboard's "Add skill" button dispatches to a session that cannot ask questions. If this
   command only works as a four-question interview, that session has nothing to follow - so the
   command has to carry an explicit path for "you were handed one sentence and nobody is there". */

test('it has a path for being run unattended from one sentence', () => {
  assert.ok(/unattended/i.test(skill),
    'no unattended path - the Add skill button dispatches into a session with nobody to answer questions')
  assert.ok(/guess|assum|infer/i.test(skill),
    'an unattended run makes assumptions; the command has to say to write them down')
  assert.match(skill, /tasks\//,
    'the guesses have to land somewhere the owner will see them - a card in tasks/')
})

/* Second reviewer finding, same day. The review card was specified with `status: todo` and no
   `for:` - and `work-the-tasks/SKILL.md` routes exactly that card to whichever agent
   `routing.md` picks and does the work as that agent. So the one card standing between a
   guessed skill and the owner would have been answered by another unattended agent run.

   The template's own escape hatch is "an ask it can't do without you", which stays `todo` with
   the reason in the digest. The card has to say so in its own first line. */

test('the review card is written so the task sweep hands it back rather than working it', () => {
  const unattended = skill.split(/\n##+ [^\n]*[Uu]nattended[^\n]*\n/)[1] ?? ''
  assert.ok(/needs you, not an agent/i.test(unattended),
    'the card body carries no line telling the sweep this is an ask it cannot do without the owner, so it gets routed and worked')
  assert.ok(/leave `?for:?`? out|no `?for:?`?|without a `?for:?`?/i.test(unattended),
    'nothing says whether to set `for:` on the review card')
  assert.ok(/work-the-tasks|task sweep|sweep/i.test(unattended),
    'it never names the sweep that would otherwise pick the card up, so the instruction reads as arbitrary')
})

test('an unattended run does not leave the skill switched on', () => {
  const unattended = skill.split(/\n##+ [^\n]*[Uu]nattended[^\n]*\n/)[1] ?? ''
  assert.ok(unattended, 'the unattended path has no section of its own')
  assert.ok(/not arm|never arm|arm nothing|arms nothing|do not arm|nothing is armed/i.test(unattended),
    'the unattended path never says it leaves the skill unarmed, and unattended plus armed is the expensive combination')
})

/* Every other command in this plugin is advertised in the storefront a stranger reads before
   installing. The existing metadata test catches a missing one; this states the reason. */

test('the plugin manifest advertises it alongside its two siblings', async () => {
  const marketplace = await read('.claude-plugin/marketplace.json')
  for (const command of ['/new-agent', '/new-workflow', '/new-skill']) {
    assert.ok(marketplace.includes(command), `marketplace.json never names ${command}`)
  }
})

test('the README lists it in the command table', async () => {
  const readme = await read('README.md')
  assert.match(readme, /\| `\/new-skill` \|/, 'the README command table has no row for /new-skill')
})

test('the command count in the README matches the folder', async () => {
  const commands = (await readdir(new URL('agent-team-os/skills/', root), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory()).length
  const readme = await read('README.md')
  const WORDS = { 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen' }
  const word = WORDS[commands] ?? String(commands)
  const claims = [...readme.matchAll(/\b(nine|ten|eleven|twelve|thirteen) commands\b/gi)]
  assert.ok(claims.length, 'the README no longer says how many commands ship')
  for (const claim of claims) {
    assert.equal(claim[1].toLowerCase(), word,
      `the README says "${claim[0]}" and ${commands} command folders ship`)
  }
})
