---
name: snapshot
description: Takes a reading of your AI plan usage (how much of each limit is used and when it resets) and saves it into your team repo so the dashboard can show it. Trigger on /snapshot, take a snapshot, update my usage, refresh the usage meters, set up my usage meters, how much of my plan have I used, update my connections, fill the connections wall, update the hermes card, or is hermes running.
---

# Snapshot - how much of your plan is used

Your dashboard can show how much of your Claude and Codex plan limits you have used, and when
they reset. It cannot look that up itself. A small script on your computer reads the numbers
and saves them as a file in your team repo. This command runs that script once, by hand.

If you have a computer that is always on, you can set that script to run by itself every few
hours instead. See `.agent-team/status/README.md` in your team repo. This command is for
everyone else, and for a quick refresh any time.

It saves percentages and times only. No logins, no tokens, no message text.

The same script also fills the **Connections wall**: which AI tools are installed here and their
versions, and which servers and plugins Claude Code and Codex have - **names only**, and whether
each one connects. It saves that in a second file, `.agent-team/status/connections/<computer>.json`.
The guide for students is `docs/guides/connections-wall.md` in the team repo, and the technical
side is `docs/guides/connections-wall-how-it-works.md`.

If this computer has **Hermes**, the script fills the **Hermes card** at the top of Connections
too: Hermes's version, whether its gateway and scheduler were beating, and for each profile the
model, how many skills, and how many conversations and scheduled runs in the last 7 days -
**counts, times and names only**, read from Hermes's own files. It saves that in a third file,
`.agent-team/status/hermes/<computer>.json`. When Hermes is alive at that moment, it also writes
Hermes's heartbeat, `runs/heartbeat/hermes.json`. Both guides above have a section on the card.

The step-by-step student guide is `docs/guides/usage-meters.md` in the team repo, and how it all
works is `docs/guides/usage-meters-how-it-works.md`. Point people there.

## Where the Claude numbers come from

The script tries these in order and uses the first that works:

1. **The status line tap - the official numbers, and the first choice.** Claude Code hands the bar
   at the bottom of its screen (the status line) the 5-hour and weekly percentages. A small script,
   the status line tap, keeps them on this computer. Used first if the reading is under 30 minutes
   old - that is, Claude Code was used here in the last half hour, on Pro or Max.
2. **The live call** - unofficial. Uses the person's Claude sign-in, without ever showing it.
3. **The status line tap again**, if the live call failed and the tap's reading is up to 6 hours old.
4. **Claude Code's own saved reading** - unofficial.

The tap carries only the 5-hour and weekly limits. A per-model weekly limit ("Weekly, Fable only")
comes only from the live call or the saved reading.

The tap only works once it is installed. If `.agent-team/onboarding-state.md` does not say
`usage-tap: installed` - or the person says "set up my usage meters" - offer it. Explain it in one
sentence and ask yes or no:

> "Can I add a small script to the bar at the bottom of Claude Code, so it saves your official
> usage numbers for the dashboard? Your current status line keeps showing - yes or no?"

Only on a yes, from the team repo root:

```bash
node scripts/install-usage-tap.mjs --dry-run
node scripts/install-usage-tap.mjs
```

Read back where it put the backup of their settings, and that
`node scripts/install-usage-tap.mjs --remove` puts back exactly what they had and deletes the copy
of the tap. The tap's numbers start after Claude's next reply, so a snapshot taken straight away
still uses the backup method.

The status line runs a **copy of the tap**, not the team repo: it runs after every reply with no
permission prompt, so code there must not be whatever was last pushed. A pull does not change the
copy. To take a newer tap, they run the installer again - after reading what changed in it.

## Files you never open

The script reads these files privately and keeps only names and numbers. They also hold sign-ins,
keys, every server's address and command, and your folders. You have no reason to look, so you
never open, read or print any of them - not to check a name, not to "help":

- `~/.claude/.credentials.json` and the **Keychain** (the Mac's password store) - the Claude sign-in
- `~/.claude.json` - your servers' addresses and commands, your projects, your account
- `~/.claude/settings.json` - your settings, which can hold keys
- `~/.claude/mcp-needs-auth-cache.json` and `~/.claude/plugins/installed_plugins.json`
- any plugin's `.mcp.json` or `plugin.json`
- `~/.codex/auth.json` - the Codex sign-in
- `~/.codex/config.toml` - Codex's servers, with their commands and settings
- Hermes's files - everything in `~/.hermes`, or `%LOCALAPPDATA%\hermes` on Windows (or wherever
  `HERMES_HOME` points), including every profile in its `profiles/` folder:
  - `.env` and `auth.json` - its keys and sign-ins
  - `SOUL.md`, `USER.md` and `memories` - who it is, who you are, what it remembers
  - `logs` and the `sessions` folder - what it did and what was said
  - `state.db` - every session, with titles, folders and chat ids. The script copies it to a
    private folder, counts from the copy and deletes the copy; you never open or query it
  - `config.yaml` - its settings, including model addresses that can carry a key
  - `gateway_state.json` - the gateway's command line, with folder paths in it
  - `cron/ticker_heartbeat`, `.update_check` and the `skills` folder

If someone asks what is in them, say the wall and the Hermes card show the names and counts, and
point them to the guide.

## Rules - read these first

- **Never open, read or print the credentials files.** That means `~/.claude/.credentials.json`,
  `~/.claude.json`, `~/.codex/auth.json`, and the Keychain (the Mac's password store). The
  script handles them privately and prints nothing secret. You have no reason to look, so do not.
- **Never run `claude mcp list` yourself.** It prints each server's command or address, with
  whatever keys are in them, into this conversation. The script runs it safely and keeps only each
  name and whether it connects.
- **Never run `hermes`**, not even `hermes --version`. It is not read-only: run once to read its
  version, it tried to update itself. The script reads Hermes's version from its files instead.
- **Never open or query Hermes's `state.db`** - not with `sqlite3`, not with a script, not "just
  to count". It holds every session's title, folder and chat, and opening it at all - even
  read-only - makes SQLite leave new files in Hermes's folder. The script copies it to a private
  folder, asks the copy one fixed question, keeps only the counts and deletes the copy.
- **Never edit `~/.claude/settings.json` yourself.** Installing the tap changes it, so the
  installer does that: it changes one key, backs the file up first, and can undo itself. Only run
  it after the person says yes.
- **If the script refuses, stop.** It has a safety check that refuses to save a file if anything
  in it looks like a secret. If that happens, tell the person which field it named, and stop.
  Never work around it: do not edit the file by hand, do not skip the check, do not run
  the pieces separately to get the file written anyway.
- **Commit only its own paths.** `--commit` saves just the usage file, the connections file, the
  Hermes file, and Hermes's heartbeat when it wrote one, in one commit. Anything else the person
  has changed in the repo stays untouched.
- **It pushes only when that push would carry the snapshot alone.** Otherwise the script
  commits the snapshot but does not push, and says why. That happens when:
  - they are on another branch (not the main branch the dashboard reads);
  - their copy has other commits the team repo's main does not have yet - even when git says
    they are up to date, because their branch follows the template's repo or another branch;
  - their copy has no remote called `origin`, or has never fetched the team repo's main;
  - their copy is behind the team repo's main;
  - the team repo has changed since their copy last fetched it (for example a commit was taken
    off it), or their pushes go to a different repo than their fetches. The script then says to
    fetch or pull, then take the snapshot again.

  Tell them what it said, in plain words. Do not push for them - a push could send their other
  work too, or put back a commit someone removed.
- **Do not push for them if the push is refused.** Say so and let them decide.

## What to do

### 1. Find the team repo and the computer's name

Work from the **team repo root** (the folder that has `scripts/collect-status.mjs`). If you are
not in it, ask where their team repo is. Do not guess.

Ask for a short label for this computer, such as "Work laptop" or "Home desktop". If
`.agent-team/status/usage/` already has a file, ask whether this is the same computer, so
the label is reused and does not create a second file.

### 2. Run it

```bash
node scripts/collect-status.mjs --computer "<label>" --commit
```

Add `--dry-run` first if they want to see what it would save without saving anything.

It fills the usage meters, the Connections wall and the Hermes card. The connections part asks
every server whether it works, so it can take up to 2 minutes - tell them that before it starts.
For the wall only, add `--only connections`; for the meters only, `--only usage`; for the Hermes
card only, `--only hermes` (quick: it runs no program at all). Parts can be combined, such as
`--only usage,connections`.

### 3. Read it back in plain words

Open the file it wrote, `.agent-team/status/usage/<computer-slug>.json`, and tell them:

- **Which plans** it found (for example Claude Max, Codex Plus).
- **How much of each limit is used**, as a percentage, and **when it resets**.
- **Which sources were not found**, and what that means. "Not found" is normal: someone who
  does not use Codex will not have Codex numbers. Say it as "no Codex data on this computer",
  not as a failure.

If a reading says unavailable, say that. Do not fill in a number.

**Which source it was.** The file names it. `claude-code-statusline` is the tap's reading - the
official numbers, which the dashboard shows with a "From Claude Code" chip (its Why? line names the
status line). `unofficial-live`
is the live call and `claude-code-saved` is Claude Code's own saved file; both are backups, labelled
unofficial. Under the Claude limits line, the script's printed summary also lists every source it
tried, in order. `- status line: found (over 30 minutes old, so the live call went first)` means
the tap had a reading but the live call was tried first; the file's source says which one won. If
the status line line says `not found`, the tap is not installed - offer it as above. If it says
`unavailable`, read them the reason; usually Claude Code has not been used on this computer for
over 6 hours.

### Reading back the Connections wall

Open `.agent-team/status/connections/<computer-slug>.json` (the file the script wrote - not the
files it read) and say, in plain words:

- **Tools**: which are **Found** (with the version), **Not found**, or **Could not check** (it may
  be there, but the script could not ask it safely - on Windows the Claude and ChatGPT apps always
  say this).
- **Servers**: how many are **Connected**, and name any that **Failed** - they can type `/mcp` in
  Claude Code to see why. **Needs sign-in** is not a failure: some are left signed out on purpose,
  and the wall shows them in grey. **Not checked** means the live check did not run; read them its
  reason from the `live` line.
- **Left out**: `projectServers` are servers of one project, counted but never named. `hidden`
  counts names that looked like a secret or an email, so they were not saved. Say the numbers, not
  that anything is wrong.

Never say or mark anything as **Proved**. Proved comes only from their connections register, after
they have tested a connection by hand. Found is not proved. The live check can take up to 2 minutes.

### Reading back the Hermes card

Open `.agent-team/status/hermes/<computer-slug>.json` (the file the script wrote - never Hermes's
own files) and say, in plain words:

- **Running or not.** The file does not say; the dashboard works it out, and so does the script's
  printed summary: `Alive by the rule: yes` means the card shows **Running** (the gateway said
  `running`, or a profile's scheduler beat, within 5 minutes of the check), and a heartbeat was
  written. `no` means the card shows **Down at last check**. A reading older than 8 hours shows
  **Not checked for** that many hours. Never say or guess that Hermes is running from anything else.
- **Version**: the number, and "update available" or "up to date" only when the file says so
  (`updateAvailable`). No `updateAvailable` means Hermes has not checked lately - say "not known".
- **Each profile**: the model ("x via provider"), how many skills, how many conversations and
  scheduled runs in the last 7 days, and when it was last active. "Not available (needs a newer
  Node)" means the sessions need Node.js 22.13 or newer - the rest of the card still works.
  `hidden` counts profiles whose names looked like a secret or their username; say the number only.
- **No Hermes here**: install, gateway and profiles all `not found`. Say "no Hermes on this
  computer", not a failure.

If they want the Hermes light on the Machines list, Hermes needs an entry in `runtimes.yml` with
`heartbeat: runs/heartbeat/hermes.json` and `stale_after_minutes: 200`, because the script only
checks every 3 hours. Offer to add it; show them the entry before you commit it.

### 4. Say what happens next

The dashboard picks the new file up the next time it loads. A reading older than about eight
hours shows as out of date, so run this again when they want fresh numbers.

## If it goes wrong

| What they saw | What to do |
|---|---|
| `scripts/collect-status.mjs` not found | Not in the team repo root, or the repo predates this script. Ask them to pull the latest template changes |
| The script names a field and refuses | Report the field name. Stop. Do not retry with the check turned off |
| Every source says not found | The apps may not be signed in on this computer. Ask them to open Claude Code or Codex, sign in, and run `/snapshot` again |
| "committed here but was not pushed, because ..." | Not an error. Read them the reason. If they are on another branch, they can switch to main and run `/snapshot` again. If they have other unpushed work, they push when that work is ready |
| "fetch or pull, then take the snapshot again" | The usage file is committed on this computer but not pushed. Help them fetch or pull, then run `/snapshot` again. Do not push the old snapshot commit yourself |
