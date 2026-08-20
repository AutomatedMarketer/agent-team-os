# Onboarding state

This file is the installer's memory. It lives in your repo so it survives a closed laptop,
a new machine, and a cloud run. Do not delete it until the install is complete.

```yaml
install_complete: false
oversight_complete: false
last_completed_phase: 0
next_phase: 1
repo_url: ""
started: ""
```

`install_complete` covers the core install, phases 1–9. `oversight_complete` covers the
two stages after it, phases 10–11. A state file written before those stages existed has
neither the key nor rows 10–11 below — the installer adds them and resumes at phase 10.

| # | Phase | Stage | Status | Finished |
|---|---|---|---|---|
| 1 | Pre-flight | 1 · Brief | pending | |
| 2 | The repo | 1 · Brief | pending | |
| 3 | About me | 1 · Brief | pending | |
| 4 | Business brain | 1 · Brief | pending | |
| 5 | Voice | 1 · Brief | pending | |
| 6 | Connectors | 2 · Access | pending | |
| 7 | Meet the team | 3 · Training | pending | |
| 8 | First routine | 3 · Training | pending | |
| 9 | Verify | 3 · Training | pending | |
| 10 | Workflows | 4 · Workflows | pending | |
| 11 | Oversight | 5 · Oversight | pending | |

Status is one of `pending`, `in-progress`, `done`, `skipped`.

## Notes

One line per phase, written as it completes. This is what a future session reads to work
out what actually happened.
