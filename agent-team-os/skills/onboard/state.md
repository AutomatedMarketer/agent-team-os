# Onboarding state

This file is the installer's memory. It lives in your repo so it survives a closed laptop,
a new machine, and a cloud run. Do not delete it until the install is complete.

```yaml
install_complete: false
last_completed_phase: 0
next_phase: 1
repo_url: ""
started: ""
```

| # | Phase | Status | Finished |
|---|---|---|---|
| 1 | Pre-flight | pending | |
| 2 | The repo | pending | |
| 3 | About me | pending | |
| 4 | Business brain | pending | |
| 5 | Voice | pending | |
| 6 | Connectors | pending | |
| 7 | Meet the team | pending | |
| 8 | First routine | pending | |
| 9 | Verify | pending | |

Status is one of `pending`, `in-progress`, `done`, `skipped`.

## Notes

One line per phase, written as it completes. This is what a future session reads to work
out what actually happened.
