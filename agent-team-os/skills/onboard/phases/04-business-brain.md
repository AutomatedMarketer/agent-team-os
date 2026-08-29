# Phase 4 — Business brain

**Time:** 20 minutes
**Ends with:** `shared/business-brain.md` with no fill markers left.

## Open with

> "Phase 4 of 12. Eight questions about the business. This is the file that decides whether
> your agents produce something you could actually send, or generic filler."

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

Expect `0`.

```bash
git add shared/business-brain.md
git commit -m "onboard: phase 4, business brain"
```
