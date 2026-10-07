---
name: snapshot
description: Takes a reading of your AI plan usage (how much of each limit is used and when it resets) and saves it into your team repo so the dashboard can show it. Trigger on /snapshot, take a snapshot, update my usage, refresh the usage meters, or how much of my plan have I used.
---

# Snapshot - how much of your plan is used

Your dashboard can show how much of your Claude and Codex plan limits you have used, and when
they reset. It cannot look that up itself. A small script on your computer reads the numbers
and saves them as a file in your team repo. This command runs that script once, by hand.

If you have a computer that is always on, you can set that script to run by itself every few
hours instead. See `.agent-team/status/README.md` in your team repo. This command is for
everyone else, and for a quick refresh any time.

It saves percentages and times only. No logins, no tokens, no message text.

## Rules - read these first

- **Never open, read or print the credentials files.** That means `~/.claude/.credentials.json`,
  `~/.claude.json`, `~/.codex/auth.json`, and the Keychain (the Mac's password store). The
  script handles them privately and prints nothing secret. You have no reason to look, so do not.
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
  - their copy has no remote called `origin`, or has never fetched the team repo's main.

  Tell them what it said, in plain words. Do not push for them - a push would send their other
  work too.
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
| The push was refused | The usage file is saved on this computer. Tell them to pull, then push, or ask for help |
