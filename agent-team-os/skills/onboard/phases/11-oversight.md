# Phase 11 — Oversight

**Time:** about 25 minutes on their computer, 60 to 90 minutes as a website
**Ends with:** a board that shows their real team and that they have talked to. On the
website path, also one task ordered by voice that landed in their repo as a commit nobody
typed.

This is stage 5 of 6. The team already works; this phase gives them a board to watch it
and give it orders. People are lost more often by not finding their way back in than by
anything technical, so the last steps (the shortcut or the phone bookmark) are not a nicety.
They are the retention step.

## Switches

One line decides whether the "on my computer" board can be offered. Change it to `ready`
only when the board and its starter files have shipped and been tried on a real Windows PC
and a real Mac.

```text
board-this-computer: coming-soon
```

- `coming-soon` — the board that runs on the student's computer is **coming soon, not built
  yet**. The board, its Settings key box and spoken questions exist; ordering tasks from it
  does not, and nobody has yet double-clicked the starter on a real Mac and a real Windows
  PC. If they pick it, say so plainly and offer the website board (see "The question").
  Do not invent an install command, a download link or a file.
- `ready` — Path A is live. Before you flip the line, read every screen name and file name in
  Path A against the running board and fix the words that differ.

## Open with

> "Phase 11 of 12: your board. Your team runs whether you watch or not. The board is your
> window onto it: who is working, what is due, and a button to give it orders, by voice if
> you like. First I need to ask you one thing."

## How this phase is driven

You are the guide, not the operator, for everything that touches their accounts: GitHub,
Vercel, OpenAI, their phone. You tell them exactly where to click and what to type.
Never ask them to paste a key, password, token or trigger link into this chat, and never
write one into a file in the repo. The settings live in the hosting dashboard (website) or
in the board's own Settings box (on their computer) and nowhere else.

If a secret gets pasted into the chat anyway: tell them to make a new one, do not repeat the
value back, and do not write it anywhere.

The only files you edit in this phase are `.agent-team/onboarding-state.md` and, in the
subscriptions step, the `subscriptions:` block of `stack.yml`.

## The question

Ask this on its own, then wait. Do not run any step before they answer.

> "Where do you want your board to live?
>
> **On my computer** — the fewest steps, about 9 short ones. It runs on this Mac or Windows PC and
> only while you have it open. Private to this computer. No phone access.
>
> **Website** — it lives at a web address you own, so it works from your phone and from any
> computer. More setup: about 25 steps, and you need a free Vercel account.
>
> You can add the other one later. Which one?"

| They say | What you do |
|---|---|
| On my computer, and the switch above says `ready` | Path A |
| On my computer, and the switch says `coming-soon` | Say: "That one is coming soon but not built yet, so I cannot set it up today." Then offer two things: set up the website board now, or pause here and come back when it is ready. On pause, write `board: this-computer-later` in the state notes and leave phase 11 as `in-progress`. |
| Website | Path B |
| Not sure | Ask one thing: "Do you want to open it from your phone?" Yes means Website. No means On my computer. |

Write their choice in `.agent-team/onboarding-state.md` as `board: this-computer` or
`board: website` as soon as they have chosen.

## Path A — On my computer

**Only when the switch above says `ready`.** Steps A1 to A7 and the question half of A8 exist
in the board now. The order half of A8 does not, and none of it has been tried on a real
Windows PC or Mac. The one step marked **NOT BUILT YET** stays that way, and the switch stays
`coming-soon`, until it exists and a real double-click test has passed.

The board is a folder on their computer with a starter file in it (`Start Board.command` on
a Mac, `Start Board.bat` on Windows). It reads their team folder, which must be a copy of
their team repo with a GitHub address it has been pushed to. In this document, **the board
folder** is that folder. (Only the board's state folder, where its settings are kept, is
called `Agent Board`.)

### A1. Check the computer (Claude does this, and says what is missing)

Run these one at a time, and report each in one plain sentence. If one fails, stop and fix
it before going on.

| Check | How | If it fails |
|---|---|---|
| Node 20 or newer | `node --version` | Missing or older than 20: send them to nodejs.org to install the current LTS version, then reopen the terminal |
| git is installed | `git --version` | Send them to git-scm.com to install it |
| The team folder points at GitHub | In the team folder: `git remote -v` | It must show a `github.com` address for their team repo. If not, fix the remote with them |
| The team repo has been pushed once, and this computer can push | In the team folder: `git push --dry-run` | Without a pushed GitHub origin the board's jobs are off: it can look but not act. Fix the sign-in with them before going on |

### A2. They say yes to the install

> "Next I put the board on this computer, in its own folder. It uses your team folder, so
> everything it does lands in your own repo. Claude Code will ask you to approve a few
> things as I go; that is normal. Say yes when you are ready."

On a yes, download the board into a new folder next to their team folder with `git clone`
(never a zip download: a zip carries a "came from the internet" mark that triggers extra
warnings). Report in one sentence what was downloaded and where.

Success looks like: the board folder exists and has `Start Board` in it. If the clone
fails, ask them to read you the error and fix what it says; do not try another way to get
the files.

**Builder note:** the exact clone address and any installer command are filled in here when
the board ships. Until then, do not guess one.

### A3. Claude tells the board where the team folder is

Write a file called `board.json` next to `Start Board`, holding the full path of the team
folder. Skip this only if the board folder sits inside the team folder.

```text
{"teamFolder": "C:/Users/jane/my-agent-team"}
```

Use the real full path on this computer. It must be valid JSON: on Windows write forward
slashes as above (or doubled backslashes), never single backslashes. Read the file back
with a JSON parse and confirm the path exists. Success looks like: you can list the team
folder's contents from that path.

### A4. They start the board

> "Open the board folder. On a Mac, double-click **Start Board.command**. On Windows,
> double-click **Start Board.bat**. A window opens, and then your browser opens with your
> board. Keep that window open while you use the board."

Success looks like: a browser tab opens with the board and their team's name on the Today
screen.

- The browser opens with a one-time link that works for **2 minutes**. If they missed the
  tab or it says the link ran out, they double-click **Start Board** again for a fresh one.
- Closing the program window stops the board. That is on purpose.
- No warning is expected, because a `git clone` does not carry the downloaded-file mark.
  If one appears anyway, ask them to read you the message before doing anything. Only as a
  fallback, and **untested on real machines**: on Windows, **More info**, then **Run
  anyway**; on a Mac, **System Settings**, **Privacy & Security**, then **Open Anyway** for
  that one file. Never tell them to switch off a security setting.
- A window flashes and closes: run the starter from a terminal so the message stays on
  screen. Usually Node is missing or older than 20.

### A5. They make an OpenAI project with a monthly limit

Say why first: voice is billed by OpenAI, separately from their Claude or ChatGPT plan.

> "Go to `platform.openai.com` and sign in. Make a new **project** and call it
> `my-board`. Open that project's **Settings**, then **Limits**, then **Spend**, and press
> **Edit spend limit**. Type a monthly amount you are happy to lose, turn on
> **hard-limit enforcement**, and press **Save**."

Success looks like: the limits page shows their amount with the hard limit on. An alert
alone only sends an email and stops nothing.

### A6. They make an API key and put it in the board's Settings

> "In that project, open **API keys** and press **Create new secret key**. Copy it. Do not
> paste it here. In the board, click **Settings**. In the row called **OpenAI key (for
> voice)**, paste the key into the box that says "Paste the key here", then click
> **Save**."

Success looks like: the row now says "saved · ends in ••••" and the last four characters.
Then they click **Test this key** and it says "This key works." The page then says "Saved.
Reload this page to turn voice on."

Say it plainly: the key is stored on this computer only, and the board never shows it
again.

If Save says the key "does not look like" an OpenAI key, they pasted the wrong key. An
Anthropic key (starting `sk-ant-`) is refused on purpose. Make a new OpenAI key and try
again.

There is an advanced Local voice option in Settings. Skip it.

### A7. They allow the microphone

> "Click **Reload the board** to turn voice on. Then click the orb that says **Talk to**
> and your assistant's name. Your browser asks to use the microphone. Press **Allow**."

If they pressed Block by mistake: the icon left of the address bar lets them change it,
then click the orb again.

### A8. They ask it a question, then give it an order

> "Say: **What's due today?** You should hear it answer out loud."

That is the end of the working part: success is that they talked to it and heard an answer.

**Giving it an order — NOT BUILT YET.** **Builder note:** starting jobs from the board is
not set up on a student's computer yet, so skip this half for now and say orders come in a
later board update. When it exists:

> "Now say: **Add a task: test the board.** A card appears asking you to confirm. Press
> **Yes**. About a minute later, a new task card shows up in your repo. Neither of us typed
> it. This is the moment the whole course has been building to."

Wait for them to tell you what they saw. Give it a beat before moving on.

### A9. Offer a shortcut

> "Want a shortcut to **Start Board** on your Desktop, so you do not have to dig for the
> folder? Yes or no."

On a yes, make the shortcut (a shortcut or alias to the starter file, not a copy). Record
the answer in the state notes.

**Not part of Path A:** phone access. If they want the board on their phone, that is the
Website path, and they can add it later.

Then go to **Both paths: usage numbers and prices** below. Skip its first question, because
this board collects its own numbers while it is open.

## Path B — Website

Their own copy of the board, at a web address they own, working from a phone. It is a lot
of small steps. Say that honestly, and say that each one is a single action.

Every setting below is typed into **Vercel's settings form**: their project, then
**Settings**, then **Environment Variables**. That form is the only place these values go.
Tick **Sensitive** on anything that is a key, password or token, and select both
**Production** and **Preview**. Changes only take effect after a **Redeploy**:
**Deployments**, the latest one, the three dots (**⋯**), **Redeploy**.

To make a long random value on their own computer, they can run this in any terminal. It
prints a value for them to copy straight into Vercel. It never needs to come to this chat:

```bash
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```

### B1. Fork the board

> "Open `github.com/automatedmarketer/agent-cockpit` and press **Fork**, top right. Keep
> the name. This copy is yours; if we disappear tomorrow, it keeps working."

Success looks like: `github.com/<their-username>/agent-cockpit` exists.

If there is no **Fork** button or the page says not found: ask them to confirm they are
signed in to GitHub, and to read you what the page shows. Do not invent another way to copy
it.

Checked on GitHub's API on 2026-10-16: `AutomatedMarketer/agent-cockpit` is public and
allows forking, and `AutomatedMarketer/agent-team-template` is public. Re-check both if a
student reports a missing Fork button.

### B2. Put it on Vercel

> "Go to `vercel.com/new`. Sign in with GitHub if it asks. Pick your `agent-cockpit` fork
> and press **Deploy**. The defaults are right. It takes under a minute."

Say up front: the first deploy may look empty or say the board is not configured. That is
expected, and B3 fixes it. A free Vercel account is enough.

### B3. Tell it which repo to read

In **Environment Variables**, add two:

| Name | Value |
|---|---|
| `GITHUB_OWNER` | Their GitHub username, or the organisation's name if the team repo lives in an organisation |
| `GITHUB_REPO` | Their team repo's name (the one from phase 2, not `agent-cockpit`) |

Success looks like: both appear in the list. Then continue to B4 or B5; the redeploy in B5
covers them.

### B4. If the team repo is private (most are)

Most are, because the business brain is in there.

> "Open `github.com/settings/personal-access-tokens/new`. Name it `board-read`. Next to
> **Resource owner**, choose the account or organisation that owns the team repo. Under
> **Repository access** choose **Only select repositories** and pick your team repo. Under
> **Permissions**, set **Contents** to **Read-only**. Nothing else. Press **Generate
> token**, copy it, and paste it straight into Vercel as `GITHUB_TOKEN`, ticking
> **Sensitive**."

Say why the scope is that narrow: the board only ever reads. A token that can write is a
token that can be abused, and this one has no reason to have write access.

Success looks like: `GITHUB_TOKEN` appears in the list. If the board's screens come up
empty after the redeploy in B5, the cause is a typo in B3 or a missing or wrong token here.

### B5. Make the sign-in

The board is locked: nobody sees it until they sign in. Three more settings:

| Name | Value |
|---|---|
| `VIEW_KEY` | The spare key. Long and random: make it with the command above. Tick **Sensitive**. Keep a copy in their password manager named "spare key" |
| `BOARD_USERNAME` | What they will sign in with. Their email is fine. Capitals and spaces do not matter |
| `BOARD_PASSWORD` | 12 characters or more. Three or four unrelated words is easy to remember and hard to guess. Tick **Sensitive** |

A password under 12 characters is ignored, and the sign-in screen says so. Then
**Redeploy**: **Deployments**, the latest one, **⋯**, **Redeploy**.

Success looks like: the deployment shows **Ready**, and opening the address shows a sign-in
screen, not an error.

### B6. Lock the front door

Two settings in their Vercel project that stop strangers from even reaching the sign-in.

1. **Settings**, then **Deployment Protection**, then **Vercel Authentication**, choose
   **All Deployments**, then **Save**. It is free on every plan.

   Why: Vercel's default, Standard Protection, leaves the main address (the one they will
   bookmark) open to anyone. This closes it. They log in to Vercel once on each device.

   Success looks like: opening the board's address in a private or incognito window asks
   for a Vercel login.
2. **Firewall**, then **New Rule**. Name it `login-limit`. Set: **Request Path** equals
   `/api/login`, then **Rate Limit**, **10 requests per 60 seconds**, keyed by **IP**.
   **Save**, then press **Publish**. A rule that is not published does nothing.

   Success looks like: the rule shows **Active**. If it shows as a draft, they have not
   pressed **Publish** yet.

Do not turn on the board's Mac mailbox mode without checking with the course first. Vercel
Authentication on All Deployments blocks anything that calls the site without a Vercel
login, and the mailbox mode is exactly that.

### B7. Sign in on the phone, and bookmark it now

This happens now, not at the end:

> "Take out your phone and open the board's address. Log in to Vercel if it asks, then type
> your board username and password once, and let the phone save them. Now add it to your
> home screen: **Share**, then **Add to Home Screen** on iPhone, or the browser menu, then
> **Add to Home screen** on Android. Do it now, while we are both looking at it."

Success looks like: the Today screen shows their repo's name at the top, and the icon is on
the phone's home screen.

### B8a. Set the OpenAI spending limit first

The limit comes before the key, so the key never exists without one.

> "Go to `platform.openai.com` and sign in. Make a new **project** called `my-board`. In
> that project's **Settings**, then **Limits**, then **Spend**, press **Edit spend limit**.
> Type a monthly amount you are happy to lose, turn on **hard-limit enforcement**, and
> press **Save**. If you like, add an alert a little below that amount too, so you hear
> first."

Success looks like: the limits page shows their amount with the hard limit switched on. An
alert alone only sends an email and stops nothing; the hard limit is what stops spending.
If their dashboard has no hard-limit switch, stop here and keep voice off.

### B8b. Make the key and put it in Vercel

> "In the same project, open **API keys** and press **Create new secret key**. Copy it and
> paste it straight into Vercel as `OPENAI_API_KEY`, ticking **Sensitive**. Do not paste it
> here. Then **Redeploy**: **Deployments**, the latest one, **⋯**, **Redeploy**."

Success looks like: a round button at the bottom right of the board. Tap it, allow the
microphone, and say "What's due today?". If there is no round button, the key is missing
or the redeploy was skipped.

### B9. Turn on the order buttons (task-intake first)

Run buttons and voice orders start your routines through Claude Code. Two things are needed:
a routine called `task-intake`, and two more settings in Vercel. Do the routine first.

**Make the `task-intake` routine**, one action at a time:

1. **Open and name it.** Open `claude.ai/code/routines`, press **New routine**, and name it
   exactly `task-intake`.
2. **Paste the instructions.** Read the prompt from the `README.md` in **their fork** of
   `agent-cockpit`: find the **Orders by voice** section and search it for "The
   task-intake prompt". Print that prompt for them in a code block, exactly as it is, so it
   always matches their board, and have them copy it into the routine's instructions.
3. **Add their repo.** Add their team repo to the routine. Keep the **Default**
   environment.
4. **Choose the trigger.** Under **Select a trigger**, choose **API**.
5. **Remove every connector.** Under **Connectors**, remove each one: this routine only
   changes the repo.
6. **Create.** Press **Create**. Success looks like: `task-intake` is in their routines
   list.

**Then copy its web address and token.** Open the routine, choose **Edit**, and open its
**API** trigger. Copy the URL. Press **Generate token** and copy it straight away: it is
shown once. Keep both in their password manager (not in a repo file and not in this chat)
until the settings below are saved, then delete that note.

**A routine for each job** they want a Run button on is made the same way, with that
job's own instructions and an **API** trigger. Its workflow file needs `fire: true` in the
trigger block, and its name in `FIRE_TRIGGERS` must match `workflows/<slug>.yml`. Start
with none or one; more can come later.

**Add two settings in Vercel:**

- `FIRE_KEY`: a long password they make up, 24 characters or more (the command above makes
  a good one). Tick **Sensitive**. Save a copy in their password manager named "fire
  key": they will type it on each new device.
- `FIRE_TRIGGERS`: one JSON object. Each routine gets its **url and token**, keyed by its
  name. Tick **Sensitive**. Start with `task-intake` only, in this shape, replacing the two
  placeholders inside Vercel's box:

  ```json
  {"task-intake": {"url": "PASTE-THE-TASK-INTAKE-URL", "token": "PASTE-THE-TASK-INTAKE-TOKEN"}}
  ```

  Add one entry per job routine, each the same shape, with the job's name as the key.
  `task-intake` must be in there. It is a routine, not a job; without it Add task, New
  workflow, Arm, Approve and Pause all fail.

Then **Redeploy**: **Deployments**, the latest one, **⋯**, **Redeploy**. Do not set
`PUBLIC_FIRE`. It drops the fire key and is not needed.

### B10. The moment the course was building to

> "On your phone, tap the round button and say: **Add a task: test the board.** A card
> asks you to confirm. Tap **Yes**. About a minute later, a new task card shows up in your
> repo. Neither of us typed it."

Warn them first: the first Yes tap on each new phone or computer asks for the fire key.
They type the "fire key" they saved in their password manager, themselves, into the box
the board shows. It is asked once per device.

Then, if they made a job routine: "On the Workflows screen, tap **Run** on that job."

Wait for them to tell you what they saw. Give it a beat before closing out.

### B11. Optional: names and pictures

Only if they want it, and only after everything above works. It needs a private picture
store, and it is a few more clicks:

1. In Vercel, their project, **Storage**, **Create Storage**, **Blob**, **Continue**.
2. Choose access **Private**. It cannot be changed later, and the board only works with a
   private store.
3. Name it, tick **Production** and **Preview**, press **Create**. If it is not connected
   to the project yet: the store's **Projects** tab, then **Connect to Project**.
4. **Redeploy**: **Deployments**, the latest one, **⋯**, **Redeploy**.

Success looks like: the Team banner shows a **Personalise** button.

## Both paths: usage numbers and prices

### U1. Which computer is always on? (Website path only)

Ask this on its own, then wait. Skip it entirely on Path A.
Questions U1, U2 and U3 are asked one at a time, never together.

> "The board can show how much of your Claude and Codex plan limits you have used, and
> when they reset. A small script on one of your computers reads those numbers and saves
> them to your repo. Is there a computer that is on all day, every day? A desktop that
> never sleeps, or a laptop that stays plugged in with sleep switched off, would do."

- **A Mac that is always on** — it can run the script by itself every three hours. Point
  them to `.agent-team/status/README.md` in their team repo, and walk the Mac schedule
  steps in it together. Do not set up a schedule on Windows in this phase.
- **No always-on computer, or not sure** — that is fine. They run `/snapshot` by hand when
  they want fresh numbers. Show them once now: run `/snapshot`, and read the result back.

Do not ask which Claude plan they are on. Phase 1 already has it. Write down the choice in
`.agent-team/onboarding-state.md` as `usage-snapshots: mac-schedule` or
`usage-snapshots: by-hand`.

### U2. Offer the usage tap

Only after U1 is answered (or, on Path A, straight after A9). This gives the board the
**official** Claude numbers: Claude Code hands its status line the 5-hour and weekly
percentages, and a small script keeps them. Without it, the snapshot falls back to an
unofficial method. Say it in one sentence and ask yes or no:

> "Can I add a small script to the bar at the bottom of Claude Code, so it saves your official
> usage numbers for the board? Your current status line keeps showing. Yes or no?"

- **On a yes**, and only if they say yes: from the **team repo root**, show the change
  first, then install:

  ```bash
  node scripts/install-usage-tap.mjs --dry-run
  node scripts/install-usage-tap.mjs
  ```

  Read back what it printed in plain words: where the backup of their settings went, and
  that `node scripts/install-usage-tap.mjs --remove` undoes it exactly and deletes the copy
  of the tap. The numbers start after Claude's next reply. Never edit
  `~/.claude/settings.json` yourself: the script changes one key and backs the file up
  first. If it says "Nothing changed", read them its reason and move on.

  Tell them in one breath why it made a **copy of the tap**: the status line runs after
  every reply with no prompt, so it runs a copy kept in their own folder, not the team
  repo. A pull does not change that copy. To take a newer tap, they run the installer
  again, after reading what changed.
- **On an always-on Mac**, run the same command from the collector's **code checkout**
  (`~/.local/share/agent-status/collector-code`), never from the **data clone**. The data
  clone is reset to the team repo on every run, so code in it is not code they have read.
- **On a no**, that is fine. The snapshot still works with the backup method.

Write down the answer in `.agent-team/onboarding-state.md` as `usage-tap: installed` or
`usage-tap: declined`. The student guide for all of this is `docs/guides/usage-meters.md`
in their team repo; point them to it.

### U3. What do they pay each month?

Only after U2 is answered:

> "Last question for this screen. What do you pay each month for your AI subscriptions?
> Claude, ChatGPT, anything like that. Tell me the name, the price, and whether it is monthly
> or yearly. A rough number is fine. Skip any you would rather not say."

Take them one at a time. For each, write one entry under `subscriptions:` in `stack.yml`:

```yaml
subscriptions:
  - name: Claude Max
    service: claude
    price: 100
    currency: USD
    per: month
```

- `name` is what they call it. `service` is a short lowercase word for the company.
- `price` is a number with no currency sign. `currency` is a three-letter code like USD or EUR.
- `per` is `month` or `year`.

The header of `stack.yml` says never to edit it by hand. Writing these entries from the
person's own answer is the approved exception, so do it yourself and do not ask them to
open the file. Change only the `subscriptions:` block, nothing else in the file. If the
block is missing, add it at the end. If they decline to answer, leave it as
`subscriptions: []` and move on.

Prices are the person's own words, so write them as given. Never look a price up for them.

## Check

- The board shows their real team: their agents and workflows are on screen
- They talked to it and heard an answer
- Website only: they ordered a task by voice, pressed Yes, and a task card landed in their
  repo as a commit they did not type
- Website only: the icon is on their phone's home screen
- The choice is recorded as `board: this-computer` or `board: website`; U1 (website only) is
  recorded; U2 is recorded as `usage-tap: installed` or `usage-tap: declined`; U3 is
  answered or declined
- No key, token, password or trigger link appears in any file in the repo or in this chat

## Close out

```bash
git add .agent-team/ stack.yml
git commit -m "onboard: phase 11, oversight"
git push
```

Set `install_complete: true` and `oversight_complete: true` in
`.agent-team/onboarding-state.md`.

One phase left, and it is the one that keeps this alive past month one:

> "Your team runs and you can watch it. The last phase is the one that makes it get better
> instead of just staying busy: your own standard, in your words, and a weekly check that
> keeps everything current. Twenty-five minutes. Continue to phase 12, or pause?"

Do not run the finishing steps in the skill file here; those close the install after phase 12.

## If it goes wrong

### Both paths

| What they saw | What to do |
|---|---|
| The board is empty or says it cannot read the repo | The repo name is wrong, or the repo is private and has no token (website), or `board.json` / the GitHub address is wrong (on their computer). Fix it and try again |
| Voice button missing or grey | The OpenAI key is missing (website: redeploy after setting it). Grey with a microphone message: the browser is blocking the microphone; the icon left of the address bar changes it |
| "Saved. Reload this page to turn voice on." | The key is saved. Click **Reload the board** |
| "Needs an OpenAI key: paste one in Settings" | The key was not saved. Open **Settings** and paste it again |
| "OpenAI's spending limit for this key is reached" | The hard limit did its job. Raise it on platform.openai.com or wait for next month |
| "Not sent: ..." in the voice panel | The board refused the order and the rest of the line says why. Read it to them |

### Website path

| What they saw | What to do |
|---|---|
| Empty screens after B5's redeploy: a typo or no token | `GITHUB_OWNER` or `GITHUB_REPO` is misspelled, or the repo is private with no `GITHUB_TOKEN`. Fix in the Vercel form, redeploy |
| "This dashboard is not configured" | `VIEW_KEY` is not set. Add it and redeploy |
| "BOARD_PASSWORD is shorter than 12 characters" | Set a longer one and redeploy. Until then the spare key (`VIEW_KEY`) signs in |
| The username and password never work | Both must be set in Vercel and followed by a redeploy. The spare key always works: tap **Use the spare key instead** |
| "Too many wrong tries from here" | Wait 15 minutes, or use the spare key from another network |
| "Reload to sign in" | Their Vercel login on this device ran out. Tap Reload and log in to Vercel again |
| "Fire is not configured" when tapping Run or ordering | `FIRE_KEY` or `FIRE_TRIGGERS` is unset. Set both and redeploy |
| "FIRE_TRIGGERS is in the old format" | Each routine needs its url and its token, as in the `FIRE_TRIGGERS` shape in B9. Fix the shape and redeploy |
| "No task-intake routine is registered" | `task-intake` is missing from `FIRE_TRIGGERS`. Add it and redeploy |
| "The token ... was refused" | That token was regenerated or mistyped. On the routine's API trigger press Regenerate, put the new token in `FIRE_TRIGGERS`, redeploy |
| "...does not have trigger.fire: true" | Add `fire: true` to that job's trigger block, commit and push |
| Tap accepted but nothing ran | The slug in `FIRE_TRIGGERS` does not match `workflows/<slug>.yml`. Match them |
| "...refused the run: it may be paused" | The routine is switched off at claude.ai/code/routines. Switch it back on |
| A 401 that will not clear | The fire key typed on the device differs from the one in Vercel. Retype it |

### On my computer path

| What they saw | What to do |
|---|---|
| The starter window flashes and closes | Run the starter from a terminal so the message stays; usually Node is missing or older than 20 |
| "The link ran out" or the tab was missed | Double-click **Start Board** again for a fresh link (they last 2 minutes) |
| The board opens but cannot read the team | `board.json` is missing or has the wrong full path, or the team folder has no GitHub address. Fix `board.json`, or `git remote -v` |
| The board looks but jobs are off | The team repo has not been pushed to GitHub, or this computer cannot push. Run `git push --dry-run` and fix it |
| "Starting jobs from the board is not set up on this computer yet" | Expected for now. Orders come in a later board update. Voice questions still work |
| An order or task never lands (once ordering exists) | The program window must still be open and show no error. Read any message to them, then check `git push --dry-run` works from the team folder |
