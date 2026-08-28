# agent-team-os

**The plugin that builds and runs an AI agent team.**

Ten commands for Claude Code. They set up a team repo, measure where your week actually goes,
propose a team from those numbers, and switch on only the jobs you approved.

This repo is **the tooling**. Your team lives in a separate repo of your own — see
[agent-team-template](https://github.com/AutomatedMarketer/agent-team-template).

---

## Who this is for

Someone running a business, or working in one, who wants repeating work to happen without being
asked — and wants to be able to check every claim the system makes about what it did.

---

## The ten commands

**Setting up**

| Command | What it does |
|---|---|
| `/onboard` | Builds your team repo across twelve resumable phases. Stop and come back; it remembers |
| `/onboard-ceo` | A six-phase variant ending with a Monday Brief. Separate flow, untouched by the rest |
| `/add-pack` | Installs a ready-made agent pack into an existing team repo |

**Deciding what to build**

| Command | What it does |
|---|---|
| `/ledger` | Interviews you about where your week actually goes and writes `ledger.yml`. Builds nothing |
| `/match` | Reads that ledger and proposes a team. Every proposal cites your words, your number, and something that already exists — or it is refused |

**Making it run**

| Command | What it does |
|---|---|
| `/routines` | Shows every scheduled routine on your account: when it fires, when it last ran. Read-only |
| `/arm` | Turns approved jobs into real routines, one at a time, each confirmed afterwards |

**Keeping it honest**

| Command | What it does |
|---|---|
| `/audit` | Checks your team repo and reports what works, what is stale, and what was never finished |
| `/new-agent` | Adds a specialist, written to the same standard as the ones that shipped |
| `/new-workflow` | Turns a conversation into one validated job file. You never write YAML |

---

## Before you start

| You need | Why |
|---|---|
| **Claude Pro or Max** | Free cannot run scheduled work |
| **Claude Code**, installed and signed in | This is a Claude Code plugin |
| **A GitHub account** connected to claude.ai | Your team runs in the cloud from a GitHub repo |
| **Node.js 20 or newer** | For the checks your team repo runs. `node --version` |

Works on Mac and Windows.

---

## Install

```
/plugin marketplace add automatedmarketer/agent-team-os
/plugin install agent-team-os
```

Then, in a new session:

```
/onboard
```

That is the whole install. There is nothing to clone and nothing to configure.

---

## Did it work?

Type `/` and look for the commands above. If `/onboard` and `/ledger` appear, the plugin is
installed.

If you are working on this repo rather than using it:

```bash
npm test
```

38 tests, no dependencies to install. They cover the deterministic helpers the skills shell out to
— the routine formatter's cron parsing and timezone arithmetic, mostly, because doing that by hand
is how a monthly job gets reported as daily.

---

## The order these are meant to be used in

The sequence is the point, and it is deliberate.

1. **`/onboard`** — the repo exists, and knows the business
2. **`/ledger`** — your week is measured, in your own words, and **you** correct the numbers
3. **`/match`** — the numbers propose a team, and honestly name what nothing here can do
4. **`/routines`** — you see what is actually scheduled on your account
5. **`/arm`** — only what you approved gets switched on

**A wrong ledger is obvious to the person who lived that week. A wrong list of agents is not.**
That is why the measuring comes first, and why `/match` refuses to propose anything while the
ledger still has problems in it.

---

## What these commands will never do

- **Arm anything you did not approve.** `/arm` reads `proposals.yml` and nothing else
- **Arm without telling you the cost.** It stops and asks for your run cap first, every time
- **Claim a routine exists without checking.** A create that returned without an error is not a
  routine that exists — it confirms with a second call before writing anything down
- **Delete a routine.** The API has no delete. Only `claude.ai/code/routines` can, in a browser.
  Said plainly rather than worked around
- **Invent a capability.** `/match` may only propose things that already exist in your repo

---

## When it breaks

| What you saw | What to do |
|---|---|
| `/onboard` is not a command | The plugin is not installed, or the session started before you installed it. Restart Claude Code |
| `/ledger` says there is no repo | Run `/onboard` first — `ledger.yml` is committed into the team repo |
| `/match` says the ledger has problems | It refuses to derive anything from numbers that are not sound. Fix what it names |
| `/arm` will not proceed | It wants your run cap said out loud, and `proposals.yml` passing its check. Both are deliberate |
| `/routines` shows nothing | Either nothing is scheduled, or the account has no routines yet. It will not guess which |
| A job fires twice a day | Two routines for one job. Remove one at `claude.ai/code/routines` — the API cannot |

---

## What is in this repo

```
agent-team-os/skills/     the ten commands
tests/                    38 tests, no dependencies
```

Each command is a `SKILL.md` — plain instructions Claude follows, which you can read and change.
One of them shells out to a script for arithmetic that deserves tests: `format-routines.mjs`
does the cron and timezone work behind `/routines`. Doing cron and timezones by hand is how a
monthly job gets reported as daily, so it is the one piece of this repo that is real code.

---

Built by [Nuno Tavares](https://github.com/AutomatedMarketer) for the V-C Ink Level 2 bootcamp.
