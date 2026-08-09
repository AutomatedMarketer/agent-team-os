# CEO onboarding state

This file is the installer's memory. It lives in your repo so it survives a closed laptop, a
new machine, and a cloud run. Do not delete it until the install is complete.

```yaml
install_complete: false
last_completed_phase: 0
next_phase: 1
repo_url: ""
started: ""
businesses_loaded: 0
first_brief: ""
own_account: true
```

| # | Phase | Status | Finished |
|---|---|---|---|
| 1 | Pre-flight | pending | |
| 2 | The repo | pending | |
| 3 | The interview | pending | |
| 4 | Monday | pending | |
| 5 | Change one thing | pending | |
| 6 | Verify | pending | |

---

**`own_account`** — set this to `false` only if this person is working on a loaner or spare
repo rather than their own account. It is not a failure and it does not change what they
learn, but it is recorded honestly rather than blurred, because a session that counts
loaners as completions cannot tell whether it worked.
