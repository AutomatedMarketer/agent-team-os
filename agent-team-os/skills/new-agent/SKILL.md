---
name: new-agent
description: Adds a sixth or later specialist to an agent team repo, written to the same standard as the five that shipped with it. Trigger on /new-agent, add an agent, build me an agent that, or I need a specialist for.
---

# New agent

You are adding a specialist to a team that already works. The new one has to be
indistinguishable in quality from the five that shipped, because six months from now
nobody will remember which was which.

## Before you write anything

Ask four questions, one at a time.

| # | Ask | Why it matters |
|---|---|---|
| 1 | "In one sentence a friend would understand, what does this agent do?" | Becomes the description. If it takes two sentences, it is two agents. |
| 2 | "How often does it run? Once a day, several times a day, or only when you ask?" | Decides the model. |
| 3 | "What does it need to see that it cannot get from your business brain?" | Decides whether it needs a `knowledge/` file. |
| 4 | "What is the worst thing it could do if it got something wrong?" | Decides the boundaries section. |

## Choosing the model

From answer 2, and nothing else:

| How often | Model | Why |
|---|---|---|
| Several times a day, or bursty | `sonnet` | High frequency, well-scoped, tool-heavy. Its literal instruction following is a safety feature on anything that touches a customer. |
| Once a day or on demand, and it needs judgment or voice | `opus` | Quality per run matters more than run count. |

Write the alias — `opus` or `sonnet` — never a version number. Aliases upgrade themselves
when a new model ships; a pinned id rots.

## What to write

Create `.claude/agents/<slug>.md`. Copy the structure of an existing agent in the repo —
`.claude/agents/research.md` is the simplest one to model on. Every section below is
required:

| Section | Content |
|---|---|
| Frontmatter | `name` matching the filename, one-line `description`, `model` alias |
| Before you start | Which files in `shared/` it reads, and what it does when they are still empty |
| How to work | Numbered steps. Say "apply this to every item, not only the first." |
| What to produce | The exact output file path and a markdown skeleton |
| Response style | The right verbosity block for its model |
| Boundaries | What it does not do, and the sentence that says it drafts and waits |
| Running unattended | The unattended-run and progress-grounding blocks |
| Your final message | The final-summary block |
| Finishing | A pointer to `.claude/skills/run-log/SKILL.md` |

The blocks are in `shared/standards/prompt-blocks/`. Copy them between markers:

```
<!-- prompt-block: unattended-run -->
<!-- /prompt-block -->
```

Then run `node scripts/sync-prompt-blocks.mjs` to fill them. Never retype a block by hand —
the tests compare them byte for byte.

## Language that fails the audit

The repo's prompt auditor rejects these. Write the right-hand column instead.

<!-- audit-ignore -->
| Do not write | Write |
|---|---|
| `CRITICAL:` anything | Nothing. Say the instruction plainly. |
| Uppercase `MUST`, `NEVER`, `ALWAYS` | Normal case. "Draft and stop." |
| "Verify your work" | Nothing. The model already does. |
| "Double-check before responding" | Nothing. |
| "Show your reasoning" | Nothing. It can trigger a refusal. |
| "Delegate to subagents freely" | Nothing. |
| "After every 3 tool calls, summarize" | Nothing. |
| "Do not write generic copy" | "Write in the voice in `shared/writing-rules.md`." |
<!-- /audit-ignore -->

That last row is the general rule: say what to do, not what to avoid.

## Register it

1. Add the slug to `AGENT_SLUGS` in `scripts/lib/run-log.mjs`
2. Add an entry to `AGENT_SPECS` in `scripts/lib/agents.mjs` with its model and blocks
3. Add the slug to `IMPLEMENTED` in `tests/agents.test.mjs`
4. Create `agents/<slug>/README.md` and `agents/<slug>/output/`
5. Add the specialist to the table in `CLAUDE.md` and to `.claude/rules/routing.md`

## Check

```bash
node scripts/sync-prompt-blocks.mjs
node scripts/build-model-card.mjs
node scripts/prompt-audit.mjs
npm test
```

All four clean. Then run the agent once by hand and read what it wrote before you schedule
it.

```bash
git add -A
git commit -m "feat: <slug> agent"
```
