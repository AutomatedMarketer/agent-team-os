# Phase 6 — Connectors

**Time:** 20 minutes
**Ends with:** Gmail and Google Calendar connected on their claude.ai account, and a written
note of what each one can reach.

## Open with

> "Phase 6 of 11. Your agents can read the web already. This gives them your inbox and your
> calendar. Twenty minutes, and most of it is clicking Allow."

## Why connectors and not keys

Say this once:

> "There are two ways to give an agent access to something. One is to paste a secret key
> into a file. The other is to sign in, in your browser, on your own account. We only ever
> do the second one. A cloud environment can be read by anyone who uses it, so a key stored
> there is a key you have given away."

## Steps

### 1. Open the connector settings

`claude.ai/settings/connectors`. They will see a directory of available connectors.

### 2. Gmail

Connect it. When Google asks what to allow, read the permissions out loud and stop on the
one that matters:

> "Notice it can read and draft. Your email agent is built to draft and stop — it never
> sends. We test that in phase 7."

### 3. Google Calendar

Same flow. Less to say — read-only is enough for what the team does.

### 4. Anything else they already use

If they mention a CRM, a help desk, or a project tool, check whether a connector exists.
If it does, connect it and note it. If it does not, say so plainly and move on — the sales
agent is built to work with no CRM, so nothing is blocked.

### 5. Write down what is connected

Append to `shared/business-brain.md`, under a new heading:

```markdown
## What my team can reach
- Gmail — read and draft, on <address>
- Google Calendar — read
- <anything else, or "nothing else yet">
```

## Check

Ask Claude, in this session: "List the connectors available to you right now." The list
should include Gmail and Calendar. If it does not, the connection did not complete — redo
step 2.

```bash
git add shared/business-brain.md
git commit -m "onboard: phase 6, connectors"
```

## If it goes wrong

| What they saw | What to do |
|---|---|
| Google says the app is not verified | This is normal for connectors in preview. Continue past it. |
| Connected, but Claude cannot see it | Start a new session. Connectors attach at session start. |
| Wrong Google account | Sign out of Google in that browser, connect again, pick the right one. |
| No Google account at all | Skip this phase. Mark it `skipped`. Phase 7 covers Research only. |
