# Phase 5 — Voice

**Time:** 15 minutes
**Ends with:** `shared/writing-rules.md` with no fill markers, including at least three real
writing samples.

## Open with

> "Phase 5 of 11. This is the shortest phase and the one that changes the output most. Three
> real things you have written beat any description of how you write."

## The questions

| Marker | Ask |
|---|---|
| `voice-samples` | **Ask this first.** "Paste me three things you have actually written. An email you sent, a post that did well, a message to a client. Not polished — real." |
| `voice-words` | "Three words for how you want to come across." |
| `signature-phrases` | "Any phrases you use a lot? Things people would recognise as yours?" |
| `banned-phrases` | "Anything that makes you cringe? 'Unlock your potential', 'in today's fast-paced world', that kind of thing." |
| `formatting-preferences` | "Short paragraphs or long? Bullets or prose? Emoji or no?" |
| `default-cta` | "When you ask someone to do something, what do you usually say? 'Book a call', 'reply to this', something else?" |

## Why samples come first

Everything else in this file is a description of a voice. The samples are the voice. If
they only have time for one question, this is the one.

If they say they have nothing written: ask them to write two sentences answering "what do
you do?" as if texting a friend. That is a sample.

## Check

```bash
grep -c "fill:" shared/writing-rules.md
```

Expect `0`. Also confirm the samples section has real content, not a description of
content — read the first line back to them and ask "is that actually yours?"

```bash
git add shared/writing-rules.md
git commit -m "onboard: phase 5, voice"
```

Then say: "Your business brain is done. From here your agents know who you are. Phase 6
gives them reach — twenty minutes. Continue or pause?"
