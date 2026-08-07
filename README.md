# agent-team-os

Build and run your own AI agent team. Level 2 of The Claude Code Workshop.

Level 1 taught you to build apps. This one hires workers.

## What you end up with

- A GitHub repo that **is** your team: an orchestrator, five agents, your business context
- Agents that run on a schedule in the cloud, while your laptop is shut
- Every run committed back to your own repo, forever, in git
- A dashboard at a URL you control
- **No API key, no server, no monthly add-on.** It runs on the Claude plan you already have.

## Install

```
/plugin marketplace add automatedmarketer/agent-team-os
/plugin install agent-team-os
```

Then:

```
/onboard
```

Nine phases, about two and a half hours of work, resumable at every boundary. Stop after
any phase, close your laptop, come back next week and type `continue onboarding`.

## What it gives you

| Command | Does |
|---|---|
| `/onboard` | Builds the whole team, from an empty GitHub account to a scheduled agent |
| `/audit` | Tells you what is working, what is stale, and what was never set up |
| `/new-agent` | Adds a specialist, written to the same standard as the five that ship |
| `/add-pack` | Installs a ready-made pack and checks it broke nothing |

## The five agents

| Agent | Model | Runs |
|---|---|---|
| Research | `sonnet` | Daily, or when you ask |
| Content | `opus` | Daily |
| Email | `sonnet` | A few times a day |
| Customer service | `sonnet` | When a customer asks — fired by a webhook, not a schedule |
| Sales | `opus` | Daily, or when you ask |

Plus the orchestrator, which is the repo itself. You talk to it; it delegates.

**Why two models.** Every scheduled run draws from your Claude plan the same way a chat
does. High-frequency agents run on Sonnet so you stay inside your daily allowance.
Judgment and voice run on Opus. Getting this wrong is the fastest way to conclude the whole
thing does not work.

## What it will not do

No agent sends an email, publishes a post, deletes a record, or spends money. They draft,
they log, they stop. The cost of a bad draft is ten seconds of reading. The cost of a bad
send is a relationship.

## Requirements

- Claude Pro or Max — scheduled runs are not available on Free
- Claude Code on the web, with GitHub connected
- A Google account, if you want the email agent to have an inbox

## The repos

| Repo | What |
|---|---|
| `agent-team-os` | This plugin |
| `agent-team-template` | The team repo `/onboard` creates from |
| `agent-cockpit` | The dashboard, forked and deployed to your own hosting |

---

Built by [Nuno Tavares](https://automatedmarketer.net) · V-C Ink
