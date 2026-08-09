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
| **One real number** | A figure they can point at **right now**, and where it came from | A number they thought of to answer the question |
| **One real name** | A person on their team, and what that person owns | "the ops team", "my assistant" |
| **One real stuck thing** | Something that has genuinely not moved, and roughly how long | "we should probably improve marketing" |

### The number gate has a trap in it — read this

If you press for a number while they are in a room, on the clock, they will **make one up**.
A brief built on an invented figure is worse than a brief with no figure, because they cannot
tell later which is which.

So ask it like this:

> *"What's your revenue this month — a figure you could point at right now, not one you'd
> have to work out?"*

And accept this, warmly, as a complete answer:

> *"I don't have that to hand."*

Then write **not measured** in the file, and note what would supply it. **That is a pass, not
a fail.** Say so out loud:

> *"Good — that's the right answer. It'll say 'not measured' rather than guess, and it'll
> tell you every week exactly what it needs. That's the difference between this and something
> that makes things up."*

The gate is testing **specificity**, not the presence of a digit.

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

**5. Current value for those three.** **[gate — the number]**
Use the wording above. Take "not to hand" for any or all of them.

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
