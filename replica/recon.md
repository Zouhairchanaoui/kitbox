# Recon Map — "Appteka" Android App Store Clone

## Scope (agreed with user)
- **App:** Appteka — open-source alternative Android app store (solkin/appteka-android, package `com.tomclaw.appsend`, appteka.store).
- **Platform:** Android.
- **Slice:** Full feature set is kept (browse/search/download, upload, APK extractor, chat/discussions, profiles, ratings, favorites, dark theme).
- **Explicit changes from the original (this is the whole point of the clone):**
  1. **No update nag dialogs.** The original checks its own version against the store and shows an "update available" popup. The clone must ship with that check removed entirely — it stays pinned to whatever version it was built at, silently, with no nag UI and no background version-check call.
  2. **New name.** Not "Appteka," not a visible variant of it (no "Appteka Pro/Lite/+"), and a new package id / app id.
  3. **Fully new visual identity.** New color palette, new icon set, new button/component shapes, new app icon and logo. Layout structure and flows stay the same; skin does not.
- **Who it's for:** user's own independent project.

## Sources

| source | URL | what it gave us |
| --- | --- | --- |
| GitHub repo (README, screenshots, license) | https://github.com/solkin/appteka-android | authoritative feature list, 4 screenshots, tech stack, localization list, legal pages |
| Google Play listing (AppTeka fork mirror pages) | appteka.store listing pages (via search) | version history / changelog entries (e.g. v21.0 added filters, reinstall/downgrade options) |
| IzzyOnDroid / F-Droid repo page | https://apt.izzysoft.de/packages/com.tomclaw.appsend | anti-feature flags (promotes non-free add-ons, crash reporting/tracking), version cadence |
| Third-party APK mirror listings | appsapk.com, appteka.store/app/* | confirms "no root," open-source fork ecosystem, store categories/filters |

Not used: app's source code / Kotlin files (present in the repo but out of scope per the clean-room rule — recon is built from docs, README and screenshots only, not by reading the app's code).

## Screen inventory

| ID | Screen | How you get there | Purpose | Key components | States seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Splash / launch | App open | Brand moment, load initial feed | logo, loader | loading |
| S02 | Store / main feed | Bottom nav "Store" | Browse & discover apps, filters (All/Open Source/Exclusive) | app card grid, category chips, search icon, filter bar | filled, loading, empty (no network) |
| S03 | Search | Tap search icon on S02 | Find an app by name | search bar, result list, recent searches | empty, typing, results, no-results |
| S04 | App details | Tap an app card | View one app, install/update, read reviews | hero image, title, rating stars, description, screenshots carousel, install button, "older versions" list, review list | filled, downloading, installed, error |
| S05 | Ratings & reviews (sub-screen of S04) | "See all reviews" on S04 | Read/write a review | review list, star picker, comment box | empty, filled |
| S06 | Upload app | Bottom nav / FAB "Upload" | Share own APK with the community | file picker, app metadata form, category picker, submit button | empty, picking file, uploading, submitted |
| S07 | APK Extractor | Bottom nav / tools menu | Pull an installed app's APK (incl. system apps) | installed-apps list, extract button, export/share sheet | list loading, extracted, error (permission) |
| S08 | Favorites | Bottom nav "Favorites" | Saved apps for later | app card list, remove (unfavorite) action | empty, filled |
| S09 | Discussions / chat (per app or global) | "Discuss" tab on S04, or bottom nav "Chat" | Real-time discussion about an app or general topics | message list, input bar, topic list | empty, filled, typing/sending |
| S10 | Profile | Bottom nav "Profile" | See own uploads, downloads, activity, reputation | avatar, stats (uploads/downloads), activity feed, settings entry | filled |
| S11 | Settings | From S10 | Theme toggle, language, about/legal | dark-mode switch, language picker, legal links | filled |
| S12 | Onboarding / permissions | First launch | Explain install-from-unknown-sources & storage permission | permission prompt, explainer text | first-run only |

**Removed in the clone vs. the original:** an "S13 Update available" modal/dialog that the original shows on top of S02 when a newer store version exists. Not rebuilt — see Feature matrix, row "in-app update check."

## User flows

```
F01 Browse and install an app
    S02 store -> S04 app details -> tap Install -> downloading -> installed
    edge: storage permission not yet granted, download fails/retries, app already installed (shows "Open" instead)

F02 Search for a specific app
    S02 -> tap search -> S03 search -> type query -> tap result -> S04
    edge: no results, network error while searching

F03 Upload own app
    S10 profile (or FAB) -> S06 upload -> pick APK file -> fill metadata -> submit -> back to S10 with new entry pending/live
    edge: file too large, unsupported format, antivirus scan flags the file

F04 Extract an installed app's APK
    S07 extractor -> pick installed app -> extract -> share/save sheet
    edge: system app without extract permission, insufficient storage

F05 Favorite and revisit an app
    S02 or S04 -> tap heart/favorite icon -> S08 favorites shows it
    edge: unfavorite from S08 removes it immediately (undo toast)

F06 Join a discussion
    S04 -> "Discuss" tab -> S09 -> type message -> send
    edge: offline (message queued), topic has no replies yet

F07 Rate and review an app
    S04 -> "See all reviews" -> S05 -> pick stars -> write comment -> submit
    edge: can't review without having installed, edit own existing review

F08 Switch theme
    S10/S11 settings -> toggle dark mode -> entire app re-skins live
```

Happy-path click count to beat (F01, the core loop): **2 taps** from store feed to a started install (card → Install).

## Components

| Component | Variants / states | Used on |
| --- | --- | --- |
| App card | grid (store feed), list row (search/favorites), compact (upload history) | S02, S03, S08, S10 |
| Install/Update button | Install / Downloading (progress) / Open / Update | S02 card, S04 |
| Star rating control | read-only display, interactive picker | S04, S05 |
| Category/filter chip | selected / unselected | S02 |
| Bottom navigation bar | 4–5 tabs (Store, Favorites, Upload, Chat, Profile) | global |
| Search bar | idle, focused, with clear button | S03 |
| Message bubble | sent / received / system | S09 |
| Toast / snackbar | success, error, undo action | global |
| Settings switch row | on/off | S11 |
| Empty state illustration + text | per-screen variants (no favorites, no results, no messages) | S02, S03, S08, S09 |
| Progress / loading skeleton | list skeleton, spinner | global |

This list becomes replica-design's component inventory — every one of these gets the new palette, new icon set, and reshaped buttons/corners the user asked for.

## Inferred data model

```
App
  id, name, package_name, icon_url, short_description, long_description,
  category, screenshots[], current_version, size_bytes, is_open_source,
  avg_rating, rating_count, upload_count, download_count, uploader_id
  evidence: S02 card fields, S04 detail fields, README filters ("Open Source"/"Exclusive")
  confidence: high

AppVersion
  id, app_id, version_name, version_code, changelog, uploaded_at, apk_url
  evidence: S04 "older versions" / "reinstall or install an older version" (changelog v21.0)
  confidence: medium

User
  id, display_name, avatar_url, joined_at, upload_count, download_count, reputation
  evidence: S10 profile stats
  confidence: medium

Review
  id, app_id, user_id, rating (1-5), comment, created_at
  evidence: S04/S05 review list and star picker
  confidence: high

Favorite
  user_id, app_id, created_at
  evidence: S08 favorites screen, heart icon on S02/S04
  confidence: high

Message / Topic
  id, app_id (nullable for global topics), user_id, body, created_at
  evidence: S09 "Discussions," README "Real-time Chat"
  confidence: medium (real-time transport mechanism is a guess — likely websockets)

Download
  user_id, app_id, version_id, downloaded_at
  evidence: S10 "track downloads", README "Track uploads, downloads, and activity"
  confidence: medium
```

## Feature matrix

See `replica/features.csv`.

## What cannot / will not be cloned

| item | reason |
| --- | --- |
| The original's user base, uploaded app catalogue, and chat history | belongs to the live Appteka network, not clonable — the clone launches with an empty catalogue that the new app's own users populate |
| Appteka name, logo, icon, and brand assets | explicitly replaced per the user's request |
| "In-app update check" / update-available dialog | explicitly removed per the user's request — the clone does not phone home to compare versions |
| Built-in multi-antivirus-engine scanning backend | the original integrates 3rd-party AV engines server-side; this is infrastructure, not UI — out of scope for a UI/UX clone, flagged for the backend step (`replica-backend`) to size separately if the user wants real malware scanning |
| GPL-licensed source code itself | not read or copied — this recon was built from the README, screenshots, and store listings only, per the clean-room rule, even though the code is technically open-source |

## Size estimate

- **Screens:** 12 (S01–S12)
- **Flows:** 8 (F01–F08)
- **Entities:** 7
- **Hard parts:**
  1. Real-time chat/discussions (needs a live transport — websockets or a BaaS realtime feature)
  2. APK extraction from other installed apps, including system apps, without root (storage/package-manager permission handling varies a lot by Android version)
  3. Server-side file handling + AV-style scanning pipeline for uploaded APKs (even a basic version needs file storage, validation, and at least virus-scan API integration)
- **Overall size: L (a quarter)** — the UI/UX rebuild alone (new skin, same flows, no update-check) is more like an M, but the upload + extractor + realtime-chat backend pushes the full feature-parity clone to L.

## Summary

**Core loop:** open the store feed, find an app, install it in two taps.
**12 screens, 8 flows**, all of the original's features kept (browse, search, upload, APK extraction, favorites, real-time discussions, profiles, ratings, dark theme) — only the brand/skin changes completely, and the update-nag dialog is dropped entirely so the clone just stays put at whatever version it ships.
**Three hardest parts:** real-time chat infrastructure, no-root APK extraction across Android versions, and a real upload/scanning pipeline.
**Out of scope:** the original's live catalogue/user base/chat history, its brand, its update-check mechanism, and its specific AV backend (sized separately if wanted).
**Next step:** `/replica-architect` to turn this into a stack, schema, and build order — or `/replica-brand` first if you want the new name and look decided before the architecture is planned.
