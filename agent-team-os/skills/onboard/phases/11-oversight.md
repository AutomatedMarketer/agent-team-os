# Phase 11 — Oversight

**Time:** 30 minutes
**Ends with:** the dashboard live at a URL they own, the fire buttons wired, the URL
bookmarked on their phone, and one job dispatched from that phone and watched to the end.

This is stage 5 of 5. The team already works; this phase makes it visible from a phone at
the school gate. More people are lost by not finding their way back in than by anything
technical — the bookmark at the end is not a nicety, it is the retention step.

## Open with

> "Phase 11 of 12: oversight. Your team runs whether you watch or not. This gives you the
> window to watch through — five screens, on your phone, at a URL you own. Half an hour,
> and the last step happens on your phone, not your laptop."

## How this phase is driven

You are the guide, not the operator. Every step here happens in **their** browser, on
**their** accounts — GitHub, Vercel, their phone. You tell them exactly where to click and
what to type; you do not run deploy commands, and nothing from this phase gets written
into a file in the repo. The dashboard's settings live in Vercel's own settings screen and
nowhere else.

## Steps

### 1. Fork the dashboard

Their copy, on their GitHub:

> "Open `github.com/automatedmarketer/agent-cockpit` and press **Fork**, top right. Keep
> the name. This copy is yours — if we disappear tomorrow, it keeps working."

### 2. Put it on Vercel

> "Go to `vercel.com/new` — sign in with your GitHub if it asks — pick your `agent-cockpit`
> fork, and press **Deploy**. There is no build step; it takes under a minute."

The first deploy shows an error about not being able to read the repo. Say up front that
this is expected — step 3 is what fixes it.

### 3. Tell it which repo to read

In their Vercel project: **Settings → Environment Variables**. They type the values into
that form. Do not ask them to paste any of these values into this chat, and do not write
any of them into a file — the Vercel form is the only place they go.

| Name | Value |
|---|---|
| `GITHUB_OWNER` | Their GitHub username |
| `GITHUB_REPO` | Their team repo's name |
| `GITHUB_TOKEN` | Only if the team repo is private — step 4 |
| `FIRE_KEY` | Step 5 |
| `FIRE_TRIGGERS` | Step 5 |

Then **Deployments → the latest one → Redeploy**. The five screens should load with their
real team on them.

### 4. If the team repo is private

Most are, because the business brain is in there.

> "Make a token at `github.com/settings/personal-access-tokens/new`. Repository access:
> only your team repo. Permissions: Contents, read-only. Nothing else. Paste it into
> `GITHUB_TOKEN` in the Vercel form, then redeploy."

Say why the scope is that narrow: the dashboard only ever reads. A token that can write is
a token that can be abused, and this one has no reason to exist with write access.

### 5. Wire the fire buttons

Every workflow with `fire: true` becomes a Run button. Two variables in the same Vercel
form make the buttons live:

- **`FIRE_KEY`** — a long random string they invent or generate
  (`openssl rand -hex 32` in any terminal works). The dashboard asks for it once per
  browser tab, on the first tap.
- **`FIRE_TRIGGERS`** — one JSON object mapping each workflow's slug to its routine's
  trigger URL. For each fire-enabled workflow: `claude.ai/code` → Routines → open the
  routine → copy its trigger URL.

Give them the shape with placeholders and let them fill the real URLs directly into the
Vercel form:

```json
{"monday-brief": "PASTE-THE-MONDAY-BRIEF-TRIGGER-URL", "weekly-review": "PASTE-THE-WEEKLY-REVIEW-TRIGGER-URL"}
```

Trigger URLs are secret-adjacent — anyone holding one can start a run on their account. So:
into the Vercel form, not into the repo, not into this chat. If one gets pasted here
anyway, tell them to regenerate it on the routine and do not repeat it back.

Redeploy once more after saving.

If their deployment is already locked behind Vercel's own authentication (team-only
access), `PUBLIC_FIRE` set to `true` skips the key prompt for same-origin taps. On a
normal public URL, leave it unset.

### 6. Bookmark it on the phone — before anything else

This happens now, not at the end of the session:

> "Take out your phone. Open the dashboard URL. Add it to your home screen — Share →
> Add to Home Screen on iPhone, the browser menu → Add to Home screen on Android. Do it
> now, while we are both looking at it."

### 7. Dispatch from the phone

The closing move of the whole install:

> "From your phone, open the Workflows screen, tap Run on one of your jobs, and put in
> your fire key when it asks. Then watch: the run appears, and when it finishes there is
> a commit in your repo that neither of us typed on a keyboard."

Wait for them to tell you what they saw. This is the moment the course was building to —
give it a beat before closing out.

## Check

- The dashboard loads at their Vercel URL with their agents and workflows on screen
- The icon is on their phone's home screen
- They confirm, in their own words: they dispatched a job from the phone and watched it
  run to a result
- No token, key, or trigger URL appears in any file in the repo or in this conversation

## Close out

```bash
git add .agent-team/
git commit -m "onboard: phase 11, oversight"
git push
```

Set `install_complete: true` and `oversight_complete: true` in
`.agent-team/onboarding-state.md`.

One phase left, and it is the one that keeps this alive past month one:

> "Your team runs and you can watch it from your phone. The last phase is the one that makes
> it get better instead of just staying busy — your own standard, in your words, and a weekly
> check that keeps everything current. Twenty-five minutes. Continue to phase 12, or pause?"

Do not run the finishing steps in the skill file here — those close the install after phase
12.

## If it goes wrong

| What they saw | What to do |
|---|---|
| Deploy succeeded but the screens are empty | `GITHUB_OWNER` or `GITHUB_REPO` is misspelled, or the repo is private with no token. Fix in the Vercel form, redeploy. |
| A 503 when tapping Run | `FIRE_KEY` or `FIRE_TRIGGERS` is unset. Closed is the endpoint's default — set both, redeploy. |
| A 401 that will not clear | The key typed on the phone differs from the one in Vercel. Retype it; the page drops a wrong key and asks again. |
| Tap accepted but nothing ran | The slug in `FIRE_TRIGGERS` does not match the workflow filename, or the workflow lacks `fire: true`. Match the slug to `workflows/<slug>.yml`. |
| A 502 on every tap | The trigger URL is wrong or the routine was deleted. Copy it fresh from the routine and update the Vercel form. |
