# Phase 12 — The standard

**Time:** 25 minutes
**Ends with:** a `done` block written in the user's own words on at least one workflow, that
workflow ending in `review-draft`, one verdict captured on a real piece, and the two weekly
jobs — Quality Review and Weekly Tune-up — scheduled and proven.

This is stage 6 of 6, and it is the phase that decides whether they still use this in three
months. Everything before it made the team **run**. This one makes the team **get better**,
and it is the only part of the install that compounds.

## Open with

> "Phase 12 of 12: your standard. Your team works now — but nothing yet checks whether what
> it makes is any good, and nothing learns from the times you had to rewrite it. That is
> what we set up now. About twenty-five minutes, and it is the part that matters in month
> three."

## The rule of this phase

**Their words, verbatim.** This phase collects the user's taste, and taste does not survive
being tidied into house style. When they say "I hate when it sounds like a LinkedIn guru",
that sentence goes into the file as written. A paraphrase stops sounding like the thing they
actually said, and a rule they do not recognise is a rule they will not defend.

## Steps

### 1. Show them a real piece, graded

Find the most recent artifact their team produced — from phase 8's routine or phase 10's
workflow. If there isn't one yet, run the workflow now and wait for it.

Read it back to them, then say what is missing:

> "This is what your team made. Right now it went straight into your inbox and nobody
> checked it. Would you have posted that as it is?"

Their answer to that question is the whole phase. Hold on to it — you will use it in step 2.

### 2. The three questions

One at a time. Never two. Take their answers down word for word.

1. **"When your team makes something good enough to use as-is, what does that look like?
   One sentence."**
   → this becomes `looks_like`

2. **"What has to be in it, every single time?"**
   → this becomes `must_have`. Stop them at five. If they give you eight, the job is two
   jobs, and you say so.

3. **"What makes you delete it on sight?"**
   → this becomes `never`, and it is the most valuable answer in the whole install.

If they stall on the third one, do not offer examples — examples get agreed with. Ask this
instead:

> "Think about the last thing your team wrote that you rewrote. What did you take out?"

Then, if they still stall, walk back through the last three artifacts in their repo with
them and ask what they would change about each. What they change twice is a `never`.

### 3. Write the standard into the workflow

You write the file. They never edit it. Add the `done` block to the workflow they care about
most, and add `review-draft` as its closing step:

```yaml
steps: [collect-voice-notes, draft-content-queue, review-draft]
done:
  looks_like: "<their sentence, verbatim>"
  must_have: [<their list, verbatim>]
  never: [<their list, verbatim>]
```

Then read it back in plain English, line by line:

> "So from tomorrow, before anything reaches you, your editor checks it against this. If it
> misses, it goes back to the writer once with the specific fix. If it misses again, you
> still get it — marked, with the reason — plus a card on your board. Nothing gets thrown
> away, ever."

**Say that last sentence out loud.** The fear in the room is always that the machine is
quietly binning work.

### 4. Run it once, in front of them

Fire the workflow from the dashboard. Wait for it. Open the output and read the report card
together:

> "Made · Quality · Confidence · Sources · Needs you. Every job your team ever does will
> report back in exactly these five lines, whichever agent did it. **Needs you** is the one
> to read first — it is the decision only you can make."

If the piece **failed**, that is a better demo than a pass. Show them the flagged reason and
the card on their board, and point out that they still have the draft.

### 5. Capture one verdict, live

This is the habit the whole loop depends on, so it has to be practised once while you are
there.

Ask what they would actually do with that piece — post it, change it, or bin it. Then run
`/capture-verdict` and let them answer in one sentence.

Show them the two files that changed: the verdict in `quality/verdicts/`, and the new rule
in `shared/writing-rules.md` or in the rubric.

> "That took ten seconds, and your team will never make that particular mistake again. This
> is the only maintenance this system needs. If you do it, it gets better every week. If you
> skip it, it stays exactly as good as it is today."

### 6. Turn on the two weekly jobs

Register both as scheduled routines, the same way phase 8 registered the first one:

| Job | When | What lands |
|---|---|---|
| **Quality Review** | Friday 17:00 | The share of the week's work they used unedited |
| **Weekly Tune-up** | Sunday 16:00 | What changed underneath them, and what to fix |

Then set expectations honestly, because the first month looks bad and they need to be warned
before it happens, not after:

> "The first Friday number will be low. That is normal and it is not a failure — the team
> has almost no rules yet. What matters is the direction over four weeks, and the verdicts
> are what move it."

### 7. What Sunday will do, and what it will not

Explain the tune-up in plain English. This is also the answer to "how do I keep this from
going out of date", which is the question they will ask in month two:

> "Every Sunday it checks whether anything you depend on has moved — a better model, a
> change in the tools, a connection that has quietly stopped working. It reads back your
> week: what failed, what you rewrote, what got flagged. Anything that went wrong **twice**
> becomes one exact fix.
>
> It writes down what it learned — a new rule, a new line in the standard. It will **not**
> change your models, your connections, or your workflows on its own. Those arrive as cards
> on your board for you to approve. It never rewires your team while you are asleep."

Then the one warning that keeps the report from becoming wallpaper:

> "If it proposes the same thing three weeks running and nothing has been done, it stops
> proposing and tells you that instead. Read the Sunday report or turn it off — a report
> nobody reads is worse than no report."

## Check

Before updating the state file, all five must hold:

1. At least one workflow has a `done` block with all three fields, in the user's own words.
2. That workflow's last step is `review-draft`.
3. The workflow has run once since, and its output carries a report card.
4. `quality/verdicts/` contains at least one verdict, and the rule it created exists in a
   file you can point at.
5. Quality Review and Weekly Tune-up are both registered as routines.

Then run `node scripts/validate-run-log.mjs` and `npm test` in their repo. Both clean, or
the phase does not advance.

## Close with

> "That is the install. Your team runs, it checks its own work, and every Sunday it tells
> you what to fix. One habit keeps all of it alive: when you use something your team made,
> or change it, say so. Ten seconds. That is the whole job now."

Then set `standard_complete: true`, commit, and push.
