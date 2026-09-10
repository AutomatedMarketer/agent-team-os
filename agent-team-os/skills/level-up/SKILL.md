---
name: level-up
description: Asks five questions about the owner's week and recommends the single highest-leverage next move for their agent team - one job, one connection, one thin brain field, or one specialist. Trigger on /level-up, what should I improve next, what is the next step, what is missing from my team, or where should I focus this week.
audience: team
---

# Level-up — find the next leverage move

You ask five questions and recommend **one** thing to do next. Not a list. One.

This is different from the other two commands that look at the same repo:

- `/audit` measures what is there - working, stale, never set up.
- `/ledger` measures the week, in hours, before anything is tailored.
- `/level-up` asks what hurts *now* and names the single move with the most leverage.

Run it after `/audit` if you can. It works on its own too.

## Read these first

1. `shared/about-me.md`, `shared/business-brain.md`, `shared/writing-rules.md` — and count
   what is still thin. A field that is filled with one broad word ("entrepreneurs", "grow") is
   thin. A `<!-- fill: ... -->` marker is empty. Both count.
2. `ledger.yml` if it exists — the tasks, their hours, and which ones are `confirmed: twice`.
3. `workflows/*.yml` — which jobs exist, and which carry `armed: false` with a reason.
4. `.agent-team/audit-log.md` — the most recent report, if there is one.
5. `quality/verdicts/` — the last few, if any. A run of `rejected` verdicts on one agent is a
   finding before you ask a single question.

Do not ask about anything you can read. If the ledger already names the task that eats their
Tuesday, open with it: "Your ledger says chasing invoices costs you three hours a week. Still
true?"

## The five questions

One at a time. Wait for the answer before the next. Plain English, no term the owner has not
already used.

1. **Drudgery.** "Walk me through last week. What did you do three or more times that felt
   manual, boring, or copy-and-paste?"
2. **The smart-intern test.** "Was there anything where you thought *a smart intern could do
   this* - and you did it yourself because explaining it would take longer?"
3. **The constraint.** "If a hundred new clients showed up on Monday, what would break first?"
4. **The growth lever.** "What would bring you a hundred more clients if it ran on its own,
   without you?"
5. **The sigh.** "What is the one thing in your day that makes you sigh?"

If they say "I don't know" to any of them, offer a default read out of their own files - the
ledger's biggest task, the agent with the most `rejected` verdicts, the empty brain field - and
ask whether it fits. Never leave a question at "I don't know".

**Vague answers do not count.** "Admin", "marketing", "everything" - ask once for the specific
thing: "Which bit of admin? The last one you did." Then move on with whatever they give you.

## How to pick

Leverage is impact if solved multiplied by how often it happens. Weigh all five answers, pick
the one with the most leverage, and recommend **one** move in one of these forms. Name the
command that does it, and offer to run it now.

| Form | When the gap is | What you recommend |
|---|---|---|
| **A · A job** | Something they do three or more times a week that existing skills could chain | "Build a job called *<name>*. It would <input> and leave <output> in <place>, every <when>. `/new-workflow` writes it; `/arm` switches it on. Type **go**." |
| **B · A connection** | A job is blocked, or done by hand, because the team cannot see a tool | "The gap is that your team cannot read <tool>. Right now you are <the manual thing> because of it. The `connect` skill in your repo wires it, proves it with a real read, and writes the recipe. Type **go**." |
| **C · A thin brain field** | An agent keeps producing generic output, and the field it needed is a marker or one broad word | "Your `<file>` says *<the thin answer>*. Every draft that mentions <topic> is generic because of that one line. Let's fill it properly now - one question. Type **go**." |
| **D · A specialist** | Real, recurring work that no shipped agent owns | "Nothing on the team owns <the work>. `/new-agent` adds one, written to the same standard as the ones that shipped. Type **go**." |
| **E · A capability** | One named thing the team should be able to do, not scheduled, not an agent | "This is one capability, not a job. `/new-skill` adds it; `/add-pack` if a ready-made pack already covers it. Type **go**." |
| **F · A parked job** | The thing they sighed about already exists as a workflow with `armed: false` | "You already have this. `workflows/<file>` is off with the reason *<reason>*. If that reason has expired, `/arm` switches it on. Type **go**." |
| **G · A stale week** | Their answers do not match the ledger | "Your ledger is from <date> and does not mention <the thing>. Weeks change. Re-run `/ledger`, then `/match`, before building anything on old numbers. Type **go**." |

Check **F** before anything else. Recommending a build for a job that already exists, switched
off, is the one recommendation that makes the owner trust this command less.

## Pick by leverage, not by ease

Lead with the move that changes the most, even if it is the biggest. If they say "too big right
now", downshift to the next-highest from their answers. Do not open with the easy one.

## After the recommendation

Wait. Then:

- **go / yes** — run the named command with the answer as context. For form C, ask the one
  question, write the answer into the file in their words, and commit it.
- **too big / smaller** — name the next-highest-leverage move from the same five answers.
- **save for later** — write it down (below) with `Action taken: deferred`, and stop.
- **already doing this** — you missed context. Say so, ask question 1 again, more specifically.

## Write it down

Append one entry to `.agent-team/level-up-log.md` in the team repo, then commit. Create the
file if it does not exist. Nothing goes in `~/.claude/`; a note that is not committed does not
exist to the next session.

```markdown
## <YYYY-MM-DD> — Level-up: <the recommendation in six words>

- **Top answer (drove it):** "<their words, verbatim>"
- **Form:** <A-G>
- **Recommended:** <one sentence>
- **Action taken:** <done / deferred / refused>
```

```bash
git add .agent-team/level-up-log.md
git commit -m "level-up: <the recommendation in six words>"
```

## Rules

- **One recommendation.** Five answers go in, one move comes out. A list is a way of not
  deciding.
- **Only recommend what exists.** A command in this plugin, a skill in their repo, or a field in
  their brain. Never a capability that would have to be invented first - that is `/match`'s
  rule, and it is this command's too.
- **Never arm anything yourself.** Form F hands off to `/arm`, which asks and confirms.
- **Their words in the log.** Not tidied.
- **No secrets.** If a connection needs a sign-in, form B hands to `connect`, which does it in
  the browser on their account.
