import test from 'node:test'
import assert from 'node:assert/strict'
import {
  describeSchedule,
  ordinal,
  relativeFuture,
  relativePast,
  repoLabel,
  buildRows,
  renderTable
} from '../agent-team-os/skills/routines/format-routines.mjs'

const TZ = 'America/New_York'

/* ---------- describeSchedule ------------------------------------------------------------
   Cron is stored in UTC. The owner reads the screen in their own timezone. Every bug this
   suite guards against was a real bug in the first prototype. */

test('a daily job reads as every day, in local time', () => {
  // 10:30 UTC on a summer date = 6:30 AM in New York (EDT, UTC-4).
  assert.equal(describeSchedule('30 10 * * *', '2026-08-27T10:37:10Z', TZ), 'every day 6:30 AM')
})

test('the same daily job shifts an hour in winter', () => {
  // The prototype that hardcodes an offset gets this wrong for half the year: in January
  // New York is EST (UTC-5), so 10:30 UTC is 5:30 AM, not 6:30.
  assert.equal(describeSchedule('30 10 * * *', '2027-01-15T10:37:10Z', TZ), 'every day 5:30 AM')
})

test('a weekly job names its day once, not twice', () => {
  // The prototype printed "Thu Thu 6:00 AM" — the weekday came from both the cron field and
  // the date formatter.
  assert.equal(describeSchedule('0 10 * * 4', '2026-08-27T10:00:00Z', TZ), 'Thu 6:00 AM')
})

test('a monthly job is not mistaken for a daily one', () => {
  // day-of-month is field 3. The prototype only looked at day-of-week, saw "*", and called
  // "the 1st of every month" a daily job.
  assert.equal(
    describeSchedule('30 15 1 * *', '2026-09-01T15:30:00Z', TZ),
    'monthly, 1st at 11:30 AM'
  )
})

test('a weekday range expands to named days', () => {
  assert.equal(describeSchedule('0 13 * * 1-5', '2026-08-27T13:00:00Z', TZ), 'Mon-Fri 9:00 AM')
})

test('a day list is kept as a list', () => {
  assert.equal(describeSchedule('0 13 * * 1,4', '2026-08-27T13:00:00Z', TZ), 'Mon/Thu 9:00 AM')
})

test('a job pinned to a month reads as a date, not a recurrence', () => {
  assert.equal(describeSchedule('0 13 1 6 *', '2027-06-01T13:00:00Z', TZ), 'Jun 1 at 9:00 AM')
})

test('an unparseable cron is reported, never guessed', () => {
  assert.equal(describeSchedule('nonsense', '2026-08-27T13:00:00Z', TZ), 'unrecognised schedule')
  assert.equal(describeSchedule('', '2026-08-27T13:00:00Z', TZ), 'unrecognised schedule')
})

/* ---------- ordinal --------------------------------------------------------------------- */

test('ordinals are right in the teens, where the naive rule breaks', () => {
  assert.equal(ordinal(1), '1st')
  assert.equal(ordinal(2), '2nd')
  assert.equal(ordinal(3), '3rd')
  assert.equal(ordinal(4), '4th')
  assert.equal(ordinal(11), '11th')
  assert.equal(ordinal(12), '12th')
  assert.equal(ordinal(13), '13th')
  assert.equal(ordinal(21), '21st')
  assert.equal(ordinal(22), '22nd')
  assert.equal(ordinal(31), '31st')
})

/* ---------- relative time ---------------------------------------------------------------- */

const NOW = Date.parse('2026-08-26T21:00:00Z')

test('a fire due within a day is counted in hours', () => {
  assert.equal(relativeFuture('2026-08-27T10:30:00Z', NOW), 'in 14h')
})

test('a fire further out is counted in days', () => {
  assert.equal(relativeFuture('2026-08-30T10:30:00Z', NOW), 'in 4d')
})

test('a scheduled time already in the past is called overdue, not negative', () => {
  assert.equal(relativeFuture('2026-06-13T13:00:00Z', NOW), 'overdue')
})

test('a routine with no next fire says so plainly', () => {
  assert.equal(relativeFuture(null, NOW), 'never')
})

test('past times read as ago', () => {
  assert.equal(relativePast('2026-08-26T10:39:00Z', NOW), '10h ago')
  assert.equal(relativePast('2026-08-20T16:55:00Z', NOW), '6d ago')
})

test('a run inside the hour reads as just now, not 0h ago', () => {
  assert.equal(relativePast('2026-08-26T20:41:00Z', NOW), 'just now')
})

/* ---------- repoLabel -------------------------------------------------------------------- */

test('a routine with no repo says so rather than showing a blank', () => {
  assert.equal(repoLabel([]), '(no repo)')
})

test('a single repo shows its short name', () => {
  assert.equal(repoLabel(['https://github.com/AutomatedMarketer/nas-deploy']), 'nas-deploy')
})

test('extra repos are counted, not truncated silently', () => {
  assert.equal(
    repoLabel(['https://github.com/openclaw/openclaw', 'https://github.com/AutomatedMarketer/openclaw-second-brain']),
    'openclaw+1'
  )
})

test('a .git suffix is stripped', () => {
  assert.equal(repoLabel(['https://github.com/AutomatedMarketer/ram-studio.git']), 'ram-studio')
})

/* ---------- buildRows -------------------------------------------------------------------- */

const ROUTINES = [
  {
    id: 'trig_alpha',
    name: 'Morning Intel - Automated Marketer team',
    cron_expression: '30 10 * * *',
    enabled: true,
    ended_reason: '',
    next_run_at: '2026-08-27T10:37:10Z',
    job_config: {
      ccr: {
        session_context: {
          sources: [{ git_repository: { url: 'https://github.com/AutomatedMarketer/automated-marketer-team' } }]
        }
      }
    }
  },
  {
    id: 'trig_beta',
    name: 'Reminder: verify Agent SDK credit',
    run_once_at: '2026-06-13T13:00:00Z',
    enabled: false,
    ended_reason: 'run_once_fired',
    next_run_at: null,
    job_config: { ccr: { session_context: { sources: [] } } }
  }
]

const RUNS = {
  trig_alpha: [
    { id: 'cse_1', created_at: '2026-08-26T10:39:19Z' },
    { id: 'cse_2', created_at: '2026-08-25T10:38:21Z' }
  ],
  trig_beta: []
}

test('rows are sorted by what fires next, so the top of the list is what matters today', () => {
  const rows = buildRows(ROUTINES, RUNS, NOW, TZ)
  // The dead one-shot has no next fire, so it sorts last despite being first in the input.
  assert.equal(rows[0].name, 'Morning Intel - Automated Marketer team')
  assert.equal(rows[1].name, 'Reminder: verify Agent SDK credit')
})

test('a healthy routine carries its schedule, next fire and last run', () => {
  const [row] = buildRows(ROUTINES, RUNS, NOW, TZ)
  assert.equal(row.when, 'every day 6:30 AM')
  assert.equal(row.next, 'in 14h')
  assert.equal(row.last, '10h ago')
  assert.equal(row.repo, 'automated-marketer-team')
  assert.equal(row.healthy, true)
})

test('a disabled or finished routine is flagged, not hidden', () => {
  const row = buildRows(ROUTINES, RUNS, NOW, TZ)[1]
  assert.equal(row.healthy, false)
  assert.match(row.note, /already fired|disabled/i)
})

test('an empty run list never claims the job never ran', () => {
  // The API says so explicitly: a fire refused before a session existed leaves no row. The
  // command must not turn "no rows" into "never ran" — that is a false accusation.
  const row = buildRows(ROUTINES, RUNS, NOW, TZ)[1]
  assert.equal(row.last, 'no runs found')
})

test('a routine id never reaches the screen', () => {
  // The owner reads this aloud; raw ids are noise. The id is carried on the row for the
  // bricks that act on it (below), but it must never be rendered.
  const out = renderTable(buildRows(ROUTINES, RUNS, NOW, TZ))
  assert.doesNotMatch(out, /trig_/)
})

test('the trigger id is still carried, out of band, for the bricks that act on it', () => {
  const [row] = buildRows(ROUTINES, RUNS, NOW, TZ)
  assert.equal(row.id, 'trig_alpha')
})

/* ---------- renderTable ------------------------------------------------------------------- */

test('every routine gets exactly one line, and nothing is truncated into a neighbour', () => {
  const rows = buildRows(ROUTINES, RUNS, NOW, TZ)
  const lines = renderTable(rows).split('\n').filter((line) => line.trim())
  const dataLines = lines.filter((line) => /^\s*[*!]/.test(line))
  assert.equal(dataLines.length, ROUTINES.length)
  for (const line of dataLines) {
    // A padded column that overflows swallows the space before the next one. The monthly
    // label is the longest we produce, and it is what broke the prototype's alignment.
    assert.doesNotMatch(line, /\S{2,}\s{0}(in \d|overdue|never)/)
  }
})

test('the table shows a count so a silently short list is obvious', () => {
  const out = renderTable(buildRows(ROUTINES, RUNS, NOW, TZ))
  assert.match(out, /2 routines/)
})

test('an empty account renders a sentence, not an empty table', () => {
  const out = renderTable([])
  assert.match(out, /no routines/i)
  assert.doesNotMatch(out, /WHEN IT FIRES/)
})
