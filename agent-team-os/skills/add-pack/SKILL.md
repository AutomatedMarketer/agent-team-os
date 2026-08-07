---
name: add-pack
description: Installs a ready-made agent pack into an existing team repo, checks it does not break the agents already there, and reports what it needs to work. Trigger on /add-pack, install a pack, or add the <name> pack.
---

# Add pack

A pack is one or more agents plus their skills, already built and audited. Installing one
should take a minute and change nothing that already works.

## Before installing

Show the user three things about the pack and wait for a `go`:

| Show | Because |
|---|---|
| What it does, in one line | They should know before it lands |
| Which model each agent uses, and how often it is meant to run | It comes out of their daily allowance |
| What it needs connected | A pack that needs a CRM is useless to someone without one |

If the pack needs something they do not have, say so plainly and ask whether they still
want it installed. A pack that says "I cannot work until you connect X" on every run is
worse than no pack.

## Installing

1. **Snapshot first.** `git status` must be clean. If it is not, commit or stash before
   going further — a half-installed pack on top of uncommitted work is hard to unpick.
2. Copy the pack's agent files into `.claude/agents/`.
3. Copy its skills into `.claude/skills/`.
4. Copy any knowledge templates into `agents/<slug>/knowledge/`, fill markers intact.
5. Register each new slug: `AGENT_SLUGS` in `scripts/lib/run-log.mjs`, `AGENT_SPECS` in
   `scripts/lib/agents.mjs`, `IMPLEMENTED` in `tests/agents.test.mjs`.
6. Add the new specialists to `CLAUDE.md` and `.claude/rules/routing.md`.
7. Regenerate the model card: `node scripts/build-model-card.mjs`.

## Check — in this order

```bash
node scripts/prompt-audit.mjs
npm test
```

Both clean. If the audit reports findings inside the pack's own files, stop and report it —
that is a defect in the pack, not something to work around locally.

Then confirm nothing already there broke:

> "Ask your research agent for anything. Then ask your content agent for anything. Both
> should behave exactly as they did before."

## Report back

```markdown
## <Pack name> installed

**Added:** <agents>, <skills>
**Models:** <slug> on <alias>, ...
**Needs connected:** <list, or "nothing">
**Suggested schedule:** <what, how often, and what that costs against the daily cap>

Your existing agents were run after install and behave unchanged.
```

## Uninstalling

Removal is the reverse, and it has to leave the repo exactly as it was:

1. Delete the pack's files from `.claude/agents/` and `.claude/skills/`
2. Remove its slugs from the three registration points
3. Regenerate the model card
4. `npm test`

Run logs the pack's agents wrote stay. They are history, and history is not undone by an
uninstall.
