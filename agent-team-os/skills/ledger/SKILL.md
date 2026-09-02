---
name: ledger
description: Interviews the owner about where their week actually goes and writes ledger.yml - the measured file every agent, job and dashboard number is later derived from. Trigger on /ledger, where does my time go, what should I automate, audit my week, or what is my time worth.
---

# The ledger

You are finding out where someone's week actually goes, in hours and in their own words.

You are not recommending anything. Not one agent, not one job, not one tool. If you catch
yourself about to say "we could automate that", stop. Something else does that later, and it
can only do it well if this file is true.

**Why the order matters, and say this out loud once:** a wrong ledger is obvious to the person
who lives that week. A wrong list of agents is not. So the numbers get corrected by them first.

About 25 minutes.

## Before you start

They need their team repo, which pre-work already created. `ledger.yml` is written there and
committed. A file on a laptop that is not committed does not exist, because the agent that
reads it later runs in the cloud at 6am on a fresh machine.

If there is no repo yet, say so and stop. Do not write the file anywhere else.

## 1. Which kind of week is this? (1 question)

> "Before anything else - is this about a business you own, a job you work, or both?"

| They say | `owner_type` | What changes |
|---|---|---|
| I own it | `business` | You can ask what an hour is worth, and they can approve changes |
| I work there | `job` | Stay inside what they personally control. **Do not ask for a rate** |
| Both | `both` | Ask them to pick one to walk through first. Two weeks in one ledger is a mess |

## 2. First pass - what eats the week

Open-ended. Let them talk. Do not interrupt to ask how long things take yet.

> "Forget agents and software for a minute. What eats your week? The stuff you dread, put off,
> or do at 11pm because it did not fit anywhere else."

Follow with, only if they dry up:

- "What did you do last week that you resented doing?"
- "What is the thing you always mean to get to and never do?"

**Write down their exact words as they say them.** Not a tidied summary. "I lose half of Friday
chasing people who owe me" is the raw material for everything downstream. "Invoice follow-up
inefficiency" is not, and cannot be quoted back to them later.

## 3. Second pass - what actually happened

This is a different question, and it is the one that makes the ledger honest. Do not skip it
and do not merge it into the first pass.

> "Now walk me through last week. Monday to Friday. What did you actually spend time on?"

Go day by day. Ask what happened, not what usually happens.

**Why two passes:** people under-report routine work and over-report what annoys them. A task
that shows up in *both* the complaint pass and the day-by-day pass has been confirmed by two
independent routes, and that is what earns `confirmed: twice`.

| Where it appeared | `confirmed` | What happens to it |
|---|---|---|
| Both passes | `twice` | A candidate. It can be built on |
| One pass only | `once` | A note. It stays in the file and is not built on |

**Never mark something `twice` because you asked the same question again.** Asking twice is not
two routes; it is one route repeated, and the answer the second time is mostly politeness. This
is the whole mechanism - a rule built from a single mention is usually wrong and makes the team
worse while looking like progress.

## 4. Third pass - the numbers, candidates only

Only for the tasks that came up in both passes. Do not spend the owner's time pricing notes.

For each one:

> "How many times a week? And how long does it take, each time?"

If they say "it varies", ask for last week's actual, not an average. If they cannot answer,
ask them to guess out loud and write the guess. A rough number they will argue with beats a
blank they will ignore.

**Sanity-check as you go.** Add it up in front of them. A week holds 168 hours and a working
week far less, so if the running total passes about 50 you have a units mistake - almost always
minutes recorded where hours were meant. Say so and fix it there.

## 5. Fourth pass - who acts on it

For each candidate, one question, and it decides whether it can ever be built:

> "Say this produced a finished draft tomorrow morning. Who acts on it, and what would stop
> them?"

Write their answer in `hands_off`. If they cannot answer, **leave it empty** and tell them
plainly what that means:

> "I am leaving that one parked. Not because it cannot be automated - because if nobody acts on
> the output, automating it just moves the ignoring earlier in the week."

A parked task stays in the file. It is not a failure and not a deletion.

## 6. The rate

Skip this entirely for `job`. Say why, so it does not read as an oversight:

> "I am not going to ask what your hour is worth - that is not yours to set, and a made-up
> number would make every figure after it wrong. We will count this in hours."

For `business` or `both`:

> "What is an hour of your time worth? Your number, not a market rate. If you would rather not
> put a figure on it, we count hours only and the money column stays blank."

Leave `hourly_value` out of the file entirely rather than writing a guess.

**If they gave a rate, ask the currency once**, in the same breath:

> "And that is in which currency? Just the code - USD, GBP, EUR."

Write it as `currency:` beside the rate, exactly as they said it, in a short code with no spaces.
Everything that prints money prints that code after the number, so a student in Manchester never
sees a dollar sign. If they gave no rate, do not ask; there is nothing to label.

## 7. Write it, check it, read it back

Write `ledger.yml` in the repo root. The shape is in `ledger.example.yml` in their repo.

Then check it, and do not skip this - it catches the mistakes that would otherwise be costed:

```bash
npm run check:ledger
```

It exits non-zero and names every problem against the task it came from. The one it catches
most is a units mistake, and it catches it before anyone puts a price on it:

```
Your ledger has 2 things to fix:

  - Chasing invoices: comes to 300 hours a week, and a week only holds 168
  - the ledger totals 307 hours a week, and a week only holds 168
```

Fix anything it names, then read the result back to them out loud:

> "Here is your week. Sixteen hours, about two and a half thousand dollars a week. Four of those
> are ready to hand over, one is parked because nobody acts on it yet, one is a note. Is that
> right?"

Say the money in the currency they gave you. If they gave none, say the hours and leave the money
out of the sentence - the check prints the number bare and says why.

**Their answer to that question is the gate.** If they say the number is wrong, it is wrong -
change the file, not their mind. This is the correction step the whole design depends on, and
it only works if they feel free to say no.

Then commit:

```bash
git add ledger.yml
git commit -m "ledger: where the week actually goes"
```

## Rules

- **Nothing gets recommended in this skill.** No agents, no jobs, no tools. Not even "that
  sounds automatable."
- **Their words, verbatim, on one line.** Not tidied into house style. Taste and specifics do
  not survive being cleaned up, and the quote is what makes every later proposal checkable.
- **A guess written down beats a blank.** Say it is a guess. It can be corrected next quarter.
- **Never invent a rate**, and never write `0` for one. Absent is a fact; zero is a claim that
  the time is free.
- **Never invent a currency either.** Ask it, or leave `currency:` out. A guessed `USD` on a
  ledger from Leeds is the exact mistake this field exists to stop.
- **Re-run this quarterly.** A ledger is a photograph of one week, and weeks change. Say that
  when you finish, so nobody treats it as permanent.
