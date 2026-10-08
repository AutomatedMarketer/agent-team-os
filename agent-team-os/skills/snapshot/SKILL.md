---
name: snapshot
description: Takes a reading of your AI plan usage (how much of each limit is used and when it resets) and saves it into your team repo so the dashboard can show it. Trigger on /snapshot, take a snapshot, update my usage, refresh the usage meters, set up my usage meters, or how much of my plan have I used.
---

# Snapshot - how much of your plan is used

Your dashboard can show how much of your Claude and Codex plan limits you have used, and when
they reset. It cannot look that up itself. A small script on your computer reads the numbers
and saves them as a file in your team repo. This command runs that script once, by hand.

If you have a computer that is always on, you can set that script to run by itself every few
hours instead. See `.agent-team/status/README.md` in your team repo. This command is for
everyone else, and for a quick refresh any time.

It saves percentages and times only. No logins, no tokens, no message text.

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

## Rules - read these first

- **Never open, read or print the credentials files.** That means `~/.claude/.credentials.json`,
  `~/.claude.json`, `~/.codex/auth.json`, and the Keychain (the Mac's password store). The
  script handles them privately and prints nothing secret. You have no reason to look, so do not.
- **Never edit `~/.claude/settings.json` yourself.** Installing the tap changes it, so the
  installer does that: it changes one key, backs the file up first, and can undo itself. Only run
  it after the person says yes.
- **If the script refuses, stop.** It has a safety check that refuses to save a file if anything
  in it looks like a secret. If that happens, tell the person which field it named, and stop.
  Never work around it: do not edit the file by hand, do not skip the check, do not run
  the pieces separately to get the file written anyway.
- **Commit only its own paths.** `--commit` saves just the usage file. Anything else the person
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

### 3. Read it back in plain words

Open the file it wrote, `.agent-team/status/usage/<computer-slug>.json`, and tell them:

- **Which plans** it found (for example Claude Max, Codex Plus).
- **How much of each limit is used**, as a percentage, and **when it resets**.
- **Which sources were not found**, and what that means. "Not found" is normal: someone who
  does not use Codex will not have Codex numbers. Say it as "no Codex data on this computer",
  not as a failure.

If a reading says unavailable, say that. Do not fill in a number.

**Which source it was.** The file names it. `claude-code-statusline` is the tap's reading - the
official numbers, which the dashboard shows as "from Claude Code’s status line". `unofficial-live`
is the live call and `claude-code-saved` is Claude Code's own saved file; both are backups, labelled
unofficial. Under the Claude limits line, the script's printed summary also lists every source it
tried, in order. `- status line: found (over 30 minutes old, so the live call went first)` means
the tap had a reading but the live call was tried first; the file's source says which one won. If
the status line line says `not found`, the tap is not installed - offer it as above. If it says
`unavailable`, read them the reason; usually Claude Code has not been used on this computer for
over 6 hours.

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
