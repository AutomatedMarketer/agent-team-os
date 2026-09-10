# Phase 4 — Business brain

**Time:** 20 minutes
**Ends with:** `shared/business-brain.md` with no fill markers left.

## Open with

> "Phase 4 of 12. Twelve questions about the business, then the claims register. This is the
> file that decides whether your agents produce something you could actually send, or generic
> filler."

## First, whose business is this?

Ask before question one, because it changes every answer that follows:

> "Is this your own business, or do you work for someone else?"

**If they work for someone else, the brain still describes the employer's business, not a
blank.** They are not the seller, but their agents still need to know what the firm sells, who
buys it and what must never be claimed. Say so plainly, then adjust the questions below from
*"what do you sell"* to *"what does the firm sell"*. Two things change:

- **Where they do not know, "I do not know - that is <name>'s call" is the right answer**, and
  a better one than a guess. Write it in. `/audit` will show it as filled, and it is honest.
- **`claims-to-avoid` matters more for them, not less.** They may have no authority to promise
  anything on the firm's behalf, and that belongs in the file.

Do not let an employee answer twelve questions with "N/A". A brain full of N/A produces exactly
the generic filler this phase exists to prevent.

## The questions

| Marker | Ask |
|---|---|
| `primary-offer` | "What is the main thing you sell? Describe it the way you would to someone at a party." |
| `pricing` | "What does it cost, and what is included?" |
| `audience` | "Who buys it? Be specific — 'small business owners' is too broad to be useful." |
| `problem` | "What is going wrong in their life right before they come to you?" |
| `tried-before` | "What have they usually tried already, before they get to you? The thing that did not work is what your agents have to write against." |
| `objections` | "What are the three things people say right before they do not buy? Too expensive, not now, tried it before - whatever you actually hear." |
| `proof` | "What results can you point to? Numbers, testimonials, case studies — anything true." |
| `competitors` | "Who else does this? Two or three names is plenty." |
| `lead-sources` | "Where do people find you today?" |
| `twelve-month-goal` | "Where is this business meant to be in twelve months? One sentence, with a number in it if you have one." |
| `tired-of-explaining` | "What are you tired of explaining? The three things you find yourself saying to every new client, or every new hire." |
| `claims-to-avoid` | "Is there anything an agent should never claim on your behalf? Guarantees, income promises, medical or legal advice?" |

## Then the verified claims register — six more markers, and they are easy to miss

The twelve questions above leave **six markers still in the file**: `verified-claim-1`, `-2`,
`-3` and a `-source` for each. They are laid out as a table, three rows of two, which is why
they get skipped. **The Check below cannot return `0` until they are done.**

> "Last one. Your agents are about to write things on your behalf. Give me up to three claims
> they are allowed to state as fact - a result, a number, a credential - and for each one,
> where it can be proven."

| Marker | Ask |
|---|---|
| `verified-claim-1` + `verified-claim-1-source` | "First claim, and where does it come from?" |
| `verified-claim-2` + `verified-claim-2-source` | "A second one?" |
| `verified-claim-3` + `verified-claim-3-source` | "A third, if there is one." |

**Fewer than three is normal and fine.** For an unused row, write `None` in both cells rather
than leaving the marker - an empty marker reads as "not asked yet", and `None` reads as "asked
and there wasn't one". Never invent a claim to fill a row.

**For someone with a job:** the claims are the firm's, and the source is usually a person -
*"Priya confirmed it"* is a legitimate source.

## If the file predates these questions

A repo built before 2026-09-10 has a `business-brain.md` with no `tried-before`, `objections`,
`twelve-month-goal` or `tired-of-explaining` section at all - no heading, no marker. The Check
below then returns `0` and asks for nothing, which is a filled file missing four answers.

So before question one, look for the four headings. Any that are absent, append to the file in
the template's wording (`## What they have already tried before they get to me`, `## The three
objections I hear before they buy`, `## Where this business is going in the next twelve months`,
`## Things I am tired of explaining`), each with its marker underneath, and ask those four. Touch
nothing else in the file.

## Do not let a vague answer through

A vague answer passes the Check and still produces the generic filler this phase exists to
prevent. The marker is gone; the problem is not. So for each of these, one follow-up before you
write anything:

| They said | Ask once |
|---|---|
| **`audience`:** "small business owners", "entrepreneurs", "anyone who..." | "Think of the last three people who actually paid. What did they have in common?" |
| **`problem`:** "they need more leads", "they are overwhelmed" | "What did the last one say, in their words, when they first got in touch?" |
| **`pricing`:** "it depends" | "What did the last one pay, and what was the thing that moved the price?" |
| **`objections`:** "price", one word | "Say it the way they say it. What is the sentence you hear?" |
| **`twelve-month-goal`:** "grow", "scale", "more clients" | "More than what? Give me a number you would recognise as done." |
| **`tired-of-explaining`:** "lots of things" | "The one you said most recently. What was it?" |

One follow-up, then write what they gave you. If the second answer is still broad, write it in
and move on - the file is theirs to sharpen later, and `/level-up` will find the thin field.

**`proof`** — if they say they have none, that is a real answer. Write "None yet" rather
than inventing something. An agent that cites a fake testimonial is worse than one that
cites nothing.

## Check

```bash
grep -o '<!-- fill: [a-z0-9-]* -->' shared/business-brain.md | wc -l
```

Expect `0`. If not, name which markers are still there and ask those questions again — the
same recovery phase 3 uses. A non-zero count here is almost always the claims register.

```bash
git add shared/business-brain.md
git commit -m "onboard: phase 4, business brain"
```
