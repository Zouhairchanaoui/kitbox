# Build log — Kitbox

| screen | date | status | missing | harder than expected |
| --- | --- | --- | --- | --- |
| Shell (tabs + stack + tokens + seed data) | 2026-11-13 | done | — | NativeWind v4's CSS-variable theming needs the `global.css` import wired into the Expo app entry at build time (Metro config), which isn't runnable in this sandbox (no network to install deps) — flagged for whoever first runs `expo start` |
| S02 Store feed | 2026-11-13 | done | real "Open Source / Exclusive" filter (category chips only cover one axis) | — |
| S04 App details | 2026-11-13 | partial | screenshots carousel, review *submission* (S05) | the install button's 4 states (Get/downloading/Open/Update) needed its own small state machine rather than a boolean — worth keeping as a named `InstallState` type rather than inlining |
| S03 Search | 2026-11-13 | done | real full-text search (uses the same in-memory array as the feed) | — |
| S08 Favorites | 2026-11-13 | done | persistence (in-memory `Set`, lost on reload) | — |
| S06 Upload | 2026-11-13 | stub | everything — file picker, metadata form, Storage upload | — |
| S10 Profile | 2026-11-13 | stub | everything — needs real auth first | — |
| S05 Reviews (write) | — | not started | star picker + comment box + submit | — |
| S07 APK Extractor | — | not started | entire screen — no-root installed-package listing is platform-specific code, not yet written | — |
| S09 Discussions/chat | — | not started | entire screen — needs Supabase Realtime wiring from architecture.md | — |
| S11 Settings | — | not started | dark-mode toggle (tokens already support it via OS setting, no manual override yet) | — |
| S12 Onboarding | — | not started | — | — |

## Notes

- **Nothing in this codebase checks Kitbox's own version against a
  server, anywhere.** Confirmed by construction: there is no such route
  in `architecture.md` and none was added here. This was the user's
  explicit, must-have requirement — calling it out so it stays visible
  in every future build pass too.
- All code in `kitbox/` is original — no file, string, or asset copied
  from Appteka's repository or screenshots. Seed data (app names,
  descriptions) is invented for this project.
- This sandbox has no network access, so `npm install` / `expo start`
  were never run here. The code is believed correct against Expo SDK 51
  + expo-router 3 + NativeWind 4 APIs but has **not been executed or
  screenshotted** — that first run, and the screenshot-every-screen step
  replica-build normally does for replica-diff, has to happen on a
  machine with Expo installed. Do that before trusting this build log's
  "done" rows as fully verified.
