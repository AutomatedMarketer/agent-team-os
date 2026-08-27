---
name: match
description: Reads ledger.yml and the team catalogue, and writes proposals.yml - what the owner's own numbers say their team should be. Every proposal cites their words, their number and a thing that already exists. Trigger on /match, what should my team be, who should I hire, what can you take off my week, or after /ledger.
audience: team
---

# The match

You are turning a measured week into a proposed team. The ledger already exists and the owner
already corrected it. Your job is to say what should answer each line of it — and, more often
than feels comfortable, to say that nothing does.

**Say this out loud once, at the start:** nothing here is a recommendation from an AI about what
is good for their business. Every line comes from a number they gave you and a thing that already
exists in their repo. If they disagree with a line, the answer is to change `ledger.yml`, not to
argue with this file.

About 15 minutes. Much of it is them reading and saying no.

## Before you start

- `ledger.yml` must exist and be sound. Run `npm run check:ledger` first. If it fails, stop and
  fix the ledger — nothing derived from a broken ledger is worth showing anyone.
- If there is no ledger at all, say so and run `/ledger` instead. Do not guess a week.

## 1. Get the shortlists

Run this **from the team repo** (`agent-team-template`, the one you cloned). This skill lives in
the `agent-team-os` plugin, but every command here runs against the team repo. It does the
arithmetic; you do the reading.

```bash
node --input-type=module -e "
import { loadLedger } from './scripts/lib/ledger.mjs'
import { loadCatalogue } from './scripts/lib/catalogue.mjs'
import { match } from './scripts/lib/match.mjs'
console.log(JSON.stringify(await (async () => match(await loadLedger(), await loadCatalogue()))(), null, 2))
"
```

You get back four things:

| | What it is | What you do with it |
|---|---|---|
| `shortlists` | Tasks with candidates, ranked | Choose one, or decline them all into `gaps` |
| `gaps` | Tasks nothing matched | Carry them across, unchanged |
| `notes` | Named once | Nothing. They are not yours to propose on |
| `parked` | Nobody acts on the output | Nothing. Same |

If `problems` is non-empty, stop. The ledger or the catalogue is not sound and the shortlists are
not trustworthy.

## 2. Choose — and this is the part only you can do

The engine ranked by counting shared words. It cannot tell a customer's **review** from a sales
pipeline **review**, or a new **starter** from the **starter** stack. You can, because you can
read the descriptions.

So for each shortlist:

1. Read the owner's exact words for the task.
2. Read each candidate's own description in full — open the file if the summary is not enough.
3. Pick the one that actually does that job. **The top-ranked candidate is often not it.**
4. If none of them does the job, **decline the whole shortlist**: put the task under `gaps:` with
   a `question` saying what you were offered and why none of it fits. That is allowed, it is
   checked for, and with a one-word floor it is frequently the right answer.

**You may only choose from the shortlist.** Not something else in the catalogue, not something
that would be nice to have. `proposalFrom()` refuses anything else, and `check:proposals` refuses
it again. This is not a formality: it is the only reason a model is allowed to choose here at all.

**Every choice needs its reason, including a sole candidate.** One line, naming what you rejected
and what decided it. "It was the only one offered" is a fact about the engine, not a reason to hand
somebody a worker — and the check will reject the file for it.

**Expect to decline a lot.** The engine shortlists anything sharing a single word, precisely so
that you get to see the right answer when it exists. The cost of that is that most shortlists also
contain two things that share a word and nothing else. Throwing those away is the job.

## 3. Write proposals.yml

Copy the shape of `proposals.example.yml` exactly. One line per value — the parser is deliberately
small and has no folded blocks. If a reason will not fit on one line, it is too long to be the
reason.

```yaml
# task    word for word from the ledger
# item    exactly as the repo names it
# why     why it does THIS job. Always required, even with one candidate.
# words   verbatim from the ledger
# number  exactly what numberCitation() produced
proposals:
  - task: Sorting the inbox
    item: skill:triage-inbox
    why: "Beat workflow:inbox-triage, which also drafts replies. They said sorting is the problem."
    words: "The inbox eats my morning before I get to anything real"
    number: "3.3 hours a week, 500 a week"

gaps:
  - task: Chasing invoices
    question: "Offered draft-chase-messages on the word chasing, but that chases a prospect who went quiet and this is money owed. Nothing here does it - should it?"
```

**Comments go on their own line.** The parser does not strip a trailing `#` from a value, so an
inline comment becomes part of the task name and the check will tell you the task is not in the
ledger. Every value is one line: there are no folded blocks.

Three rules about the citations, all enforced in code:

- **`words` is verbatim.** Character for character from the ledger. Not tidied, not shortened.
- **`number` is what the ledger derives**, rendered exactly. Not a rounder, nicer number, and not
  the raw `predicted` object — `predicted.hoursPerWeek` is `3.3333333333333335` and the string the
  check wants is `"3.3 hours a week, 500 a week"`. Get it right by asking for it:

  ```bash
  node --input-type=module -e "
  import { loadLedger } from './scripts/lib/ledger.mjs'
  import { loadCatalogue } from './scripts/lib/catalogue.mjs'
  import { match, numberCitation } from './scripts/lib/match.mjs'
  const r = match(await loadLedger(), await loadCatalogue())
  for (const e of r.shortlists) console.log(JSON.stringify(e.task), JSON.stringify(numberCitation(e.predicted)))
  "
  ```
- **`item` is its own citation.** It must exist and it must have been on that task's shortlist.

Carry **every** gap across. A gap you drop is a question the owner never gets asked, and the gaps
list is what decides what gets built next.

## 4. Check it before showing anyone

```bash
npm run check:proposals
```

This re-derives everything and refuses whatever does not hold up. If it fails, fix the file — do
not argue with it and do not edit the ledger to make a proposal fit. It catches, among others:

- a proposal for something named only once, or that nobody acts on
- an item that was never shortlisted, or does not exist
- a quote that has been improved, or a number that has been rounded up
- a shortlisted task you said nothing about, or a gap you dropped
- a choice made with no reason given, including when there was only one candidate
- a decline that does not say why none of the candidates fit

## 5. Read it back to them

Print it with `npm run check:proposals` and go line by line. For each one:

> "You said *[their words]*. That is *[the number]* a week. **[The item]** does that. Yes or no?"

Then the gaps, which matter more than they look:

> "These are things you named twice that nothing on the team does. I am not going to pretend
> otherwise. Are any of these worth building?"

**Expect them to say no to some.** A no is not a failure of the match; it is the ledger being
corrected one layer later, which is exactly what this whole order exists to allow. Move the row to
`gaps` with what they said, and re-run the check.

## Check

- [ ] `npm run check:ledger` passed before you started
- [ ] `proposals.yml` exists, is committed, and `npm run check:proposals` passes
- [ ] Every shortlisted task is either proposed or declined into `gaps` — none silently dropped
- [ ] Every proposal carries a `why`, including the sole-candidate ones
- [ ] Every decline says what was offered and why none of it fits
- [ ] Every gap the engine found is carried across
- [ ] You read it back and they said yes or no to each line
- [ ] Nothing was built, armed, or switched on. That is the next brick, not this one

## What this skill must never do

- **Never propose something that is not on the shortlist.** Including something you are confident
  is right. If the engine did not offer it, the words did not agree, and that is worth knowing.
- **Never build anything.** No agents, no skills, no workflows, no routines. This writes one file.
- **Never edit `ledger.yml` to make a proposal fit.** The ledger is theirs.
- **Never fill a gap with the nearest thing that shares a word.** A gap left honest is worth more
  than a gap answered wrongly, because the gaps list is the input to what gets built next.
