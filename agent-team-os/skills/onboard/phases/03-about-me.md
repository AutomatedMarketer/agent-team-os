# Phase 3 — About me

**Time:** 15 minutes
**Ends with:** `shared/about-me.md` with no `<!-- fill: ... -->` markers left.

## Open with

> "Phase 3 of 12. Five questions about you, not your business. Your agents read this before
> every job, so it decides whether they sound like a stranger or like your colleague."

## The questions

One at a time. After each answer, write it into the file, replacing the matching fill
marker. Do not batch them and write at the end — if they stop halfway, what they answered
is already saved.

| Marker | Ask |
|---|---|
| `full-name` and `role` | "What is your name, and what do you call what you do?" |
| `one-line-business` | "Finish this sentence: I help ___ do ___." |
| `communication-preferences` | "When an agent reports back to you, do you want the short version or the detail? And bullets or paragraphs?" |
| `timezone` | "What city are you in, and what hours do you actually work?" |
| `hard-boundaries` | "What should an agent never do without asking you first? Most people say: send anything, spend anything, promise anything." |

If someone gives a one-word answer, ask one follow-up, then move on. This is not a
psychology session.

## Do not let a vague answer through

A vague answer clears the Check and leaves the agent no better informed. One follow-up, then
write what they gave you:

| They said | Ask once |
|---|---|
| **`one-line-business`:** "I help businesses grow" | "Which businesses, and grow what? Fill both blanks with something you could point at." |
| **`communication-preferences`:** "whatever works" | "Last time something reported back to you and it annoyed you - was it too long, or too short?" |
| **`timezone`:** a country, or "normal hours" | "Which city, and what time does your working day actually start and stop?" |
| **`hard-boundaries`:** "use common sense" | "Name one thing that, if an agent did it without asking, you would switch the whole team off." |

Write the second answer in their words. If it is still broad, write it anyway and move on;
`/level-up` will find the thin field later.

## Writing it

Replace each `<!-- fill: name -->` line with the answer, in their words, not yours. Keep
their phrasing — that is half the point of the file.

## Check

```bash
grep -o '<!-- fill: [a-z0-9-]* -->' shared/about-me.md | wc -l
```

Expect `0`. If not, name which markers are still there and ask those questions again.

Then:

```bash
git add shared/about-me.md
git commit -m "onboard: phase 3, about me"
```
