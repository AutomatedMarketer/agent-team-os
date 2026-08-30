# Phase 4 — Business brain

**Time:** 20 minutes
**Ends with:** `shared/business-brain.md` with no fill markers left.

## Open with

> "Phase 4 of 12. Eight questions about the business, then the claims register. This is the
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

Do not let an employee answer eight questions with "N/A". A brain full of N/A produces exactly
the generic filler this phase exists to prevent.

## The questions

| Marker | Ask |
|---|---|
| `primary-offer` | "What is the main thing you sell? Describe it the way you would to someone at a party." |
| `pricing` | "What does it cost, and what is included?" |
| `audience` | "Who buys it? Be specific — 'small business owners' is too broad to be useful." |
| `problem` | "What is going wrong in their life right before they come to you?" |
| `proof` | "What results can you point to? Numbers, testimonials, case studies — anything true." |
| `competitors` | "Who else does this? Two or three names is plenty." |
| `lead-sources` | "Where do people find you today?" |
| `claims-to-avoid` | "Is there anything an agent should never claim on your behalf? Guarantees, income promises, medical or legal advice?" |

## Then the verified claims register — six more markers, and they are easy to miss

The eight questions above leave **six markers still in the file**: `verified-claim-1`, `-2`,
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

## Two things worth pushing on

**`audience`** — if they answer broadly, ask "Think of the last three people who bought.
What did they have in common?" That answer is the useful one.

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
