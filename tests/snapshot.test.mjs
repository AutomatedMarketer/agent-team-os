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
  assert.match(snapshot, /other (commits|work)[^.]*(not (yet )?pushed|does not have)|unpushed/i)
  assert.match(snapshot, /another branch|not on (the )?(main|default) branch/i)
  assert.match(snapshot, /(commits|saves) the snapshot[^.]*(but )?(does not|doesn't|won't) push/i)
  assert.match(snapshot, /says why|tells them why|tell them (what|why)/i)
  // The old promise said nothing about pushing at all, while the script pushed everything.
  assert.match(snapshot, /pushes only the snapshot|push(es)? (it )?only when/i)
})

// "Not yet pushed" was not the whole story: a copy that follows the template's own repo, or
// another branch, can look up to date in git and still hold commits the team repo has never seen.
// The skill must name those cases and the missing-origin case, so the model does not "fix" a
// held-back push by pushing.
test('/snapshot names every case where the snapshot is committed but not pushed', () => {
  assert.match(snapshot, /team repo('s main)? does not have( yet)?/i)
  assert.match(snapshot, /up to date/i)
  assert.match(snapshot, /template/i)
  assert.match(snapshot, /no remote called (`)?origin(`)?/i)
})

// The collector's push only lands if the team repo still holds exactly what this copy last
// fetched. When it does not - the repo moved, a commit was taken off it, or pushes go to another
// repo - the snapshot is held back with "fetch or pull, then take the snapshot again". The skill
// must say that, and must not tell the person to push it themselves: that push is exactly the one
// the collector refused to make.
test('/snapshot passes on "fetch or pull, then take the snapshot again" instead of pushing', () => {
  assert.match(snapshot, /changed since (they|this copy|their copy) last fetched/i)
  assert.match(snapshot, /fetch or pull/i)
  assert.match(snapshot, /different repo/i)
  assert.doesNotMatch(snapshot, /tell them to pull, then push/i)
})

// The status line tap gives the OFFICIAL Claude reading: Claude Code hands its status line the
// 5-hour and weekly percentages, and the tap keeps them for the collector. It only works once it is
// installed, and installing it edits the person's own Claude Code settings - so phase 11 offers it
// with a plain yes or no, right after the always-on question, and never installs it unasked.
test('phase 11 offers the usage tap after the always-on question, as its own yes-or-no', () => {
  const always = phase.indexOf('### 8. Which computer is always on?')
  const tap = phase.indexOf('### 9. Offer the usage tap')
  const pay = phase.indexOf('### 10. What do they pay each month?')
  assert.ok(always >= 0 && tap > always && pay > tap, 'the steps are not always-on, then the tap, then prices')
  const offer = phase.slice(tap, pay)
  assert.match(offer, /node scripts\/install-usage-tap\.mjs/)
  assert.match(offer, /team repo root/i)
  assert.match(offer, /\byes or no\b/i)
  assert.match(offer, /only (on|after) (a )?yes|on a yes|if they say yes/i)
  assert.match(offer, /--dry-run/)
  assert.match(offer, /--remove/)
  assert.match(offer, /usage-tap: (installed|declined)/)
  assert.match(offer, /docs\/guides\/usage-meters\.md/)
  // The one sentence a person hears before deciding: what it is, in plain words.
  // Continuation lines of the quote are joined; the opening `> "` is kept.
  const said = /> "([^"]+)"/.exec(offer.replace(/\r?\n> (?!")/g, ' '))?.[1] ?? ''
  assert.match(said, /status line|bottom of Claude Code/i)
  assert.ok(said.split(/(?<=[.?!])\s+/).length <= 3, 'the offer is more than a sentence and a question')
  // On the always-on Mac it runs from the pinned code checkout, never the data clone.
  assert.match(offer, /code checkout/i)
  assert.match(offer, /data clone/i)
  assert.match(phase, /Questions 8, 9 and 10 are asked one at a time/)
})

test('phase 11 records the tap answer before closing out', () => {
  const check = phase.slice(phase.indexOf('## Check'), phase.indexOf('## Close out'))
  assert.match(check, /usage-tap/)
})

test('/snapshot names the status line tap as the first source, and points to the guide', () => {
  assert.match(snapshot, /status line tap/i)
  assert.match(snapshot, /first/i)
  assert.match(snapshot, /official/i)
  assert.match(snapshot, /docs\/guides\/usage-meters\.md/)
  assert.match(snapshot, /node scripts\/install-usage-tap\.mjs/)
  assert.match(snapshot, /--remove/)
  // "Set up my usage meters" is what the student guide tells people to say.
  assert.match(snapshot, /^description: .*set up my usage meters/m)
})

test('/snapshot lets the installer edit settings.json, and never edits it by hand', () => {
  assert.match(snapshot, /settings\.json/)
  assert.match(snapshot, /never edit `~\/\.claude\/settings\.json` yourself/i)
  assert.match(snapshot, /yes or no/i)
  assert.match(snapshot, /only on a yes|only run\s+it after the person says yes/i)
})

// The contract gave the tap its own source name, claude-code-statusline, which the board shows as
// official. The skill must say so, and must not tell anyone the tap is filed as a saved copy.
test('/snapshot names each source by what the file says, the tap as claude-code-statusline', () => {
  assert.match(snapshot, /`claude-code-statusline`[^.]*official/)
  assert.match(snapshot, /`claude-code-saved`/)
  assert.match(snapshot, /`unofficial-live`/)
  assert.match(snapshot, /status line: found/)
  assert.doesNotMatch(snapshot, /claude-code-saved` both for the tap/)
})

// The decided order (template): the tap wins only under 30 minutes old, then the live call, then
// the tap up to 6 hours, then Claude Code's saved file. The tap carries only the 5-hour and weekly
// windows, so a per-model weekly meter needs a backup source.
test('/snapshot gives the decided source order, and what the tap does not carry', () => {
  const section = snapshot.slice(snapshot.indexOf('## Where the Claude numbers come from'), snapshot.indexOf('## Rules'))
  const steps = section.split('\n').filter((line) => /^\d\. /.test(line))
  assert.equal(steps.length, 4)
  assert.match(steps[0], /status line tap/i)
  assert.match(section.replace(/\s+/g, ' '), /under 30 minutes old/)
  assert.match(steps[1], /live call/i)
  assert.match(steps[2], /tap.*again/i)
  assert.match(section.replace(/\s+/g, ' '), /up to 6 hours old/)
  assert.match(steps[3], /saved/i)
  assert.match(section.replace(/\s+/g, ' '), /only the 5-hour and weekly/i)
  assert.match(section.replace(/\s+/g, ' '), /per-model weekly/i)
})

// SECURITY (template review): the status line runs after every reply with no prompt, so the
// installer copies the tap out of the team repo and the status line runs the copy. A pull does
// not change it; running the installer again - after reading the change - is the update. The
// skill and the onboarding step must tell the person that, and that --remove deletes the copy.
test('/snapshot and phase 11 say the tap runs from a copy that a pull does not change', () => {
  for (const [name, text] of [['/snapshot', snapshot], ['phase 11', phase]]) {
    const doc = text.replace(/\s+/g, ' ')
    assert.match(doc, /copy of the tap/i, `${name} does not say the status line runs a copy`)
    assert.match(doc, /pull does not change/i, `${name} does not say a pull leaves the copy alone`)
    assert.match(doc, /run(ning)? the installer again/i, `${name} does not say how to update`)
    assert.match(doc, /read(ing)? (what changed|the change)/i, `${name} does not say to read the change first`)
    assert.match(doc, /--remove`?[^.]*deletes? the copy/i, `${name} does not say --remove deletes the copy`)
  }
})
