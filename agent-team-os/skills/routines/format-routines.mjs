#!/usr/bin/env node
// Turns the raw routines API response into the table a human reads.
//
// Why this is a script and not prose in SKILL.md: every function below was a bug in the
// first draft. Cron's day-of-month field was ignored, so monthly jobs printed as "every
// day". The weekday came from both the cron field and the date formatter, so Thursday
// printed twice. And a hardcoded UTC offset is wrong for half the year. Those are pure
// functions with right and wrong answers — so they get tests, and the model calls them
// rather than doing the arithmetic in its head each time.
//
// Reads one JSON object on stdin:
//   { "routines": [...],                      // the .data array from RemoteTrigger list
//     "runs": { "<trigger_id>": [...] } }     // .data from list_runs, per routine
// Writes the table on stdout. Reads nothing else and calls nothing.

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function ordinal(n) {
  // 11th/12th/13th are the exceptions the naive last-digit rule gets wrong.
  const teen = n % 100
  if (teen >= 11 && teen <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

// The cron time is UTC. Render it at the wall clock the owner actually lives on, using the
// offset in force on the date it next fires — which is how daylight saving stays correct
// without anyone tracking it.
function localClock(anchorIso, hour, minute, timeZone) {
  const anchor = new Date(anchorIso)
  if (Number.isNaN(anchor.getTime())) return null
  const instant = new Date(Date.UTC(
    anchor.getUTCFullYear(), anchor.getUTCMonth(), anchor.getUTCDate(), hour, minute
  ))
  return new Intl.DateTimeFormat('en-US', {
    timeZone, hour: 'numeric', minute: '2-digit'
  }).format(instant)
}

// "1-5" -> Mon-Fri, "1,4" -> Mon/Thu, "4" -> Thu. Ranges keep the dash because "Mon-Fri"
// is how people say it; explicit lists keep the slash because they are not a span.
function namedDays(field) {
  if (/^\d+-\d+$/.test(field)) {
    const [from, to] = field.split('-').map(Number)
    if (DAYS[from] && DAYS[to]) return `${DAYS[from]}-${DAYS[to]}`
  }
  const parts = field.split(',')
  if (parts.every((part) => /^\d+$/.test(part) && DAYS[Number(part)])) {
    return parts.map((part) => DAYS[Number(part)]).join('/')
  }
  return null
}

export function describeSchedule(cron, anchorIso, timeZone) {
  const fields = String(cron ?? '').trim().split(/\s+/)
  if (fields.length !== 5) return 'unrecognised schedule'
  const [minuteField, hourField, dom, monthField, dow] = fields
  if (!/^\d+$/.test(minuteField) || !/^\d+$/.test(hourField)) return 'unrecognised schedule'

  const time = localClock(anchorIso, Number(hourField), Number(minuteField), timeZone)
  if (!time) return 'unrecognised schedule'

  // Most specific field wins: a pinned month is a date, a pinned day-of-month is monthly,
  // a day-of-week is weekly, and everything open is daily.
  if (monthField !== '*') {
    const month = MONTHS[Number(monthField) - 1]
    if (month && /^\d+$/.test(dom)) return `${month} ${Number(dom)} at ${time}`
    return 'unrecognised schedule'
  }
  if (dom !== '*') {
    if (!/^\d+$/.test(dom)) return 'unrecognised schedule'
    return `monthly, ${ordinal(Number(dom))} at ${time}`
  }
  if (dow !== '*') {
    const days = namedDays(dow)
    return days ? `${days} ${time}` : 'unrecognised schedule'
  }
  return `every day ${time}`
}

export function relativeFuture(iso, now) {
  if (!iso) return 'never'
  const ms = new Date(iso).getTime() - now
  if (Number.isNaN(ms)) return 'never'
  if (ms < 0) return 'overdue'
  const hours = ms / 3_600_000
  return hours < 24 ? `in ${Math.round(hours)}h` : `in ${Math.round(hours / 24)}d`
}

export function relativePast(iso, now) {
  if (!iso) return 'no runs found'
  const ms = now - new Date(iso).getTime()
  if (Number.isNaN(ms)) return 'no runs found'
  const hours = ms / 3_600_000
  if (hours < 1) return 'just now'
  return hours < 24 ? `${Math.round(hours)}h ago` : `${Math.round(hours / 24)}d ago`
}

export function repoLabel(urls) {
  const names = (urls ?? [])
    .map((url) => String(url).replace(/\.git$/, '').split('/').filter(Boolean).pop())
    .filter(Boolean)
  if (!names.length) return '(no repo)'
  return names.length === 1 ? names[0] : `${names[0]}+${names.length - 1}`
}

function sourceUrls(routine) {
  return (routine?.job_config?.ccr?.session_context?.sources ?? [])
    .map((source) => source?.git_repository?.url)
    .filter(Boolean)
}

export function buildRows(routines, runs, now, timeZone) {
  return (routines ?? []).map((routine) => {
    const nextRunAt = routine.next_run_at ?? null
    const fired = Boolean(routine.ended_reason)
    const disabled = routine.enabled === false

    const when = routine.cron_expression
      ? describeSchedule(routine.cron_expression, nextRunAt ?? routine.updated_at ?? routine.created_at, timeZone)
      : routine.run_once_at
        ? `one-shot ${String(routine.run_once_at).slice(0, 10)}`
        : 'unrecognised schedule'

    // list_runs is "most recently active first", so the head is the latest run. An empty
    // list is NOT proof it never ran: the API skips fires that were refused before a
    // session existed. Say what we know — no rows — and never accuse it of never running.
    const history = runs?.[routine.id] ?? []
    const latest = history[0]?.created_at ?? null

    const notes = []
    if (fired) notes.push(routine.ended_reason === 'run_once_fired' ? 'already fired' : routine.ended_reason)
    if (disabled) notes.push('disabled')
    if (routine.suspension_reason) notes.push(`suspended: ${routine.suspension_reason}`)

    return {
      id: routine.id,                       // held for the bricks that act; never rendered
      name: routine.name ?? '(unnamed)',
      when,
      next: relativeFuture(nextRunAt, now),
      last: relativePast(latest, now),
      repo: repoLabel(sourceUrls(routine)),
      healthy: !fired && !disabled && !routine.suspension_reason,
      note: notes.join(', '),
      sortKey: nextRunAt ? new Date(nextRunAt).getTime() : Number.POSITIVE_INFINITY
    }
  }).sort((a, b) => a.sortKey - b.sortKey || a.name.localeCompare(b.name))
}

export function renderTable(rows) {
  if (!rows.length) {
    return 'You have no routines yet — nothing is scheduled to run on its own.'
  }
  // Width each column to its widest value, so a long label can never eat the gap before
  // the next column. The prototype used fixed widths and "monthly, 1st at 11:30 AM" ran
  // straight into the next field.
  const width = (key, heading) =>
    Math.max(heading.length, ...rows.map((row) => String(row[key]).length))
  const w = {
    when: width('when', 'WHEN IT FIRES'),
    next: width('next', 'NEXT'),
    last: width('last', 'LAST RUN'),
    repo: width('repo', 'REPO')
  }
  const pad = (value, size) => String(value).padEnd(size)
  const header = `   ${pad('WHEN IT FIRES', w.when)}  ${pad('NEXT', w.next)}  ${pad('LAST RUN', w.last)}  ${pad('REPO', w.repo)}  JOB`
  const rule = `   ${'-'.repeat(header.length - 3)}`
  const body = rows.map((row) => {
    const mark = row.healthy ? '*' : '!'
    const note = row.note ? `  (${row.note})` : ''
    return ` ${mark} ${pad(row.when, w.when)}  ${pad(row.next, w.next)}  ${pad(row.last, w.last)}  ${pad(row.repo, w.repo)}  ${row.name}${note}`
  })
  const unhealthy = rows.filter((row) => !row.healthy).length
  const tally = unhealthy
    ? `${rows.length} routines — ${rows.length - unhealthy} armed, ${unhealthy} needing a look`
    : `${rows.length} routines, all armed`
  return [tally, '', header, rule, ...body].join('\n')
}

/* ---------- entry point ------------------------------------------------------------------ */

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  if (!raw) {
    console.error('Nothing on stdin. Pipe the RemoteTrigger list response in as JSON.')
    process.exit(1)
  }
  let payload
  try {
    payload = JSON.parse(raw)
  } catch (error) {
    console.error(`That is not JSON: ${error.message}`)
    process.exit(1)
  }
  const timeZone = process.env.ROUTINES_TZ || Intl.DateTimeFormat().resolvedOptions().timeZone
  const rows = buildRows(payload.routines ?? payload.data ?? [], payload.runs ?? {}, Date.now(), timeZone)
  console.log(renderTable(rows))
  console.log(`\nTimes shown in ${timeZone}.`)
}

// Only run when invoked directly, so the test suite can import the helpers without the
// script sitting there waiting on a stdin that never arrives.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, '/')}`).href) {
  main()
}
