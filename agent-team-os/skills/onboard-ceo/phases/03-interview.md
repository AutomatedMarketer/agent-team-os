# Phase 3 — The interview

**30 minutes. This phase decides whether the whole thing works.**

The brief is only ever as good as what you get here. A generic brief is the one outcome that
kills this for the person reading it, and it is caused in this phase — not later.

You are not filling in a form. You are doing an intake. **One question at a time, never two,
and follow the interesting answer before you move on.**

## What you are filling in

| File | What goes in it |
|---|---|
| `shared/ceo.md` | Who they are, how they decide, what they are avoiding, their boundary |
| `shared/businesses/<name>.md` | **One** business. Copy `_TEMPLATE.md`, rename, fill |
| `shared/people/team.md` | Four or five names and what they own |
| `shared/cadence.md` | When the brief arrives, and what it lands before |
| `shared/standards/tone.md` | Light touch. Two or three lines is enough today |

**You write all of it.** They never see a file. They talk, you type, you show them what you
wrote at the end of each section in one line.

---

## The three gates

**You may not finish this phase until you have all three.** They are what stand between a
brief that is about their business and a brief that could be about anybody's.

| Gate | What counts | What does not |
|---|---|---|
| **One real source** | A named report, on a named day, from a named person — *"flash report, Thursdays, from Denise"* | A figure recited from memory. See below |
| **One real name** | A person on their team, and what that person owns | "the ops team", "my assistant" |
| **One real stuck thing** | Something that has genuinely not moved, and roughly how long | "we should probably improve marketing" |

### The number gate has a trap in it — read this twice

The obvious version of this gate fails, and it fails on the most confident person in the room.

If you ask *"what's your revenue?"* and offer *"I don't have that to hand"* as the escape,
you catch the person who admits it. **You do not catch the proud one** — and a CEO in a room,
with their coach beside them, is proud. They will give you a real-sounding figure that is
twelve months stale or half-remembered from a report they skimmed. Nobody in the room can
detect it, including them. That number then sits in the repo forever, wrong, and every figure
downstream inherits its authority.

**So do not ask for the number. Ask for the report.**

> **"What report already lands on your desk, and what day does it land?"**

*"Flash report, Thursdays, from Denise."* That is a far better answer than any figure, because:

- Nobody is embarrassed by it. There is no admission in it
- It is **true every week**, not true once
- It names the source, so the brief can tag where the number came from
- It tells you what to ask for next week

Only after they name the report do you ask what the latest one said — and if they cannot
remember, **that is fine and expected**, because now you know where it comes from.

If there is no report at all for a metric, write **not measured** and name the report that
would supply it. Say so warmly:

> *"Good — it'll say 'not measured' rather than guess, and it'll tell you every Monday what
> would fix it. That's the difference between this and something that makes things up."*

The gate tests **whether the number has a source**, not whether they can produce a digit.

---

## The sequence

Ten questions. Roughly three minutes each. Marked **[gate]** where one of the three lives.

**1. Who you are.**
> *"Give me one line — what do you actually run?"*

**2. Which business today.**
If they run more than one: *"We're loading one today. Which one is on your mind most this
week?"* **Cap it at one.** Adding the second later takes five minutes and the brief picks it
up automatically with nothing else to change — tell them that, so the cap does not feel like
a limitation.

**3. What it sells, and to whom.** One or two sentences, plain.

**4. The three numbers that matter.**
> *"If you could only see three numbers for this business every Monday, what are they?"*

If they name eight, ask which three they would keep. Choosing is the value.

**5. Where those numbers come from.** **[gate — the source]**
> *"For each of those — what report already lands on your desk, and what day?"*

Get the report, the day, and the person. Then, and only then: *"and what did the last one
say?"* Not remembering is fine — you have the source, which is the durable thing.

**6. What's broken right now.** **[gate — the stuck thing]**
> *"What's the thing in this business that hasn't moved in weeks?"*

Get roughly how long. That becomes the first tracked item, with an age, in their first brief
— and watching that age tick up is the most useful thing this system does.

**7. The team.** **[gate — the name]**
> *"Four or five names. Who are they and what do they own?"*

If somebody owns nothing identifiable, write that down. Unowned work is a finding.

**8. Your week.**
> *"When do you want this? Monday 6am is the default. And what does it need to land before —
> a leadership meeting, a board day?"*

**9. The boundary.** Ask exactly this:

> **"Finish this sentence. This system may draft, summarise and remind. It may never
> ______ without me."**

Common answers: contact a client · commit money · say anything to my team · touch anything
involving someone's job.

Write it into `shared/ceo.md` verbatim. Then tell them what it means:

> *"That line beats anything anyone asks it to do later, including you in a hurry."*

**Do not go further than this one sentence today.** The fuller version — everything they
would never want drafted, everything they want to be asked about — is take-home. It is the
most personal thing a founder will tell you and it does not get an honest answer typed into a
laptop in a room in week zero.

**10. How you decide.**
> *"When you make a call, do you decide fast and revisit, or slowly and stick? And do you
> want options, or a recommendation?"*

This is what stops Block 5 of the brief reading like a consultant wrote it.

---

## Things that will happen

| What you see | What you do |
|---|---|
| They start perfecting an answer | *"Rough is fine — it improves every week."* Move on |
| They want all their businesses in | One today. Say why, warmly |
| They give a number that is clearly a guess | *"Is that one you could point at, or a rough sense?"* Rough sense → **not measured** |
| They go quiet on the boundary question | Offer two examples, let them pick one. Do not leave it blank |
| They tell you something sensitive | Write down what is useful, leave out what is not. Say what you wrote |
| You are at 25 minutes and on question 6 | Skip 10, then 8. **Never skip 5, 6, 7 or 9** |

## Before you close the phase

Read back, in **five lines**, in their words: what they run, the three numbers, the stuck
thing, one name, and the boundary. Ask if any of it is wrong.

Then check the gates honestly. If one is missing, get it now — thirty seconds — because
there is no second chance at it later in the session.

## Write to the state file

`businesses_loaded: 1`, phase 3 complete, `next_phase: 4`. Commit with a message naming the
business.
