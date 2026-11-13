# Architecture — Kitbox (Appteka clone)

Reads `replica/recon.md` and `replica/features.csv`. Branding from
`replica/brand.md` / `brand.json` (name: Kitbox, violet palette).

## Step 1: Stack

The original is a native Kotlin Android app with no web presence, so
Kitbox's mobile client is the product — the stack below is picked for
that, not for a web app that happens to exist too.

| layer | choice | why |
| --- | --- | --- |
| mobile app | **Expo (React Native)** | one codebase, fast to iterate, EAS Build ships to Play Store without owning a Mac/CI rig; swap for Kotlin only if you specifically want to stay native like the original |
| backend/API | **Next.js (App Router) route handlers on Vercel** | same language as the client (TypeScript), no separate backend service to run |
| database | **Postgres on Supabase** | managed, free tier covers early use, built-in Auth/Storage/Realtime so three "hard parts" from recon (realtime chat, file storage, auth) come from one vendor |
| ORM | **Drizzle** | typed SQL close to the metal, easy to read the generated queries when debugging RLS issues |
| auth | **Supabase Auth** | email/password + OAuth out of the box, issues the JWT that Postgres RLS reads via `auth.uid()` |
| realtime (chat) | **Supabase Realtime** (Postgres logical replication on the `messages` table) | no separate websocket server to run for F06 |
| file storage (APK uploads) | **Supabase Storage** | resumable/direct-to-storage uploads bypass serverless function body-size limits — needed for APK files that can run to 50+ MB |
| background jobs | **Inngest** | event-driven (`app_version.uploaded` → scan job), free tier is enough at this scale |
| malware scanning | **a single reputable scanning API** (e.g. a VirusTotal-style multi-engine API) to start | original claims 3 independent AV engines server-side; that's real infrastructure cost — start with one vendor, size "three engines" as a should-have once there's a user base to justify it |
| push notifications | **Expo Notifications** | only if the "new reply / new version" could-have feature gets built |
| hosting | **Vercel** (API) + **Supabase** (DB/Auth/Storage/Realtime) + **EAS** (mobile builds) | all managed, nothing to patch or scale manually at this size |

No payments layer — the app and its catalogue are free, matching the
original. No microservices — one Postgres database, one API, one mobile
client.

## Step 2: Schema

Full SQL in `replica/schema.sql`. Summary of the 7 tables from recon's
data model, now real:

- **users** — Supabase-managed auth identity plus profile fields
- **apps** — the catalogue entry; `search_tsv` generated column backs S03 search
- **app_versions** — one row per uploaded build; `scan_status` tracks the AV pipeline; `apps.current_version_id` points at the live one
- **reviews** — one per `(app_id, user_id)`, enforced by a unique constraint so a second submission is an edit, not a duplicate
- **favorites** — a pure join table, composite primary key
- **topics** / **messages** — `topics.app_id` is nullable so the same table serves both per-app discussions (F06) and global topics (could-have)
- **downloads** — an append-only log, used for both the profile's "downloads" stat (S10) and for re-serving an older version (F01 edge case)

**Access rules:** Postgres row-level security (RLS), not an app-layer
check — every policy is in `schema.sql`. Read access to the catalogue,
versions, reviews, topics and messages is public (it's a browsable
store); writes are scoped to `auth.uid()` matching the owning row.

**Hard constraint the recon flagged:** two reviews from the same user
racing each other is handled by the `unique (app_id, user_id)` constraint
plus an upsert (`insert ... on conflict do update`) in the API route, not
by checking-then-writing in application code.

## Step 3: API

One route per flow. All routes are the clone's own backend — nothing
calls Appteka's private endpoints.

| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/apps` | store feed, paginated, filterable by category/open-source | public | `?category=&open_source=&cursor=` | app[] | F01 |
| `GET /api/apps/search` | full-text search | public | `?q=` | app[] | F02 |
| `GET /api/apps/:id` | app detail: current version, avg rating, screenshots | public | — | app + current_version | F01, F04 |
| `GET /api/apps/:id/versions` | older versions, for reinstall/downgrade | public | — | app_version[] | F01 edge case |
| `POST /api/apps/:id/download` | logs a download, returns a signed APK URL | authenticated | `{version_id?}` (defaults to current) | `{download_url}` | F01 |
| `POST /api/apps` | create a new app listing | authenticated | metadata + first APK via Storage signed upload | app | F03 |
| `POST /api/apps/:id/versions` | upload a new version of an existing app | authenticated, owner only | version metadata + APK via Storage signed upload | app_version | F03 |
| `POST /api/apps/:id/favorite` | add to favorites | authenticated | — | 204 | F05 |
| `DELETE /api/apps/:id/favorite` | remove from favorites | authenticated | — | 204 | F05 |
| `GET /api/favorites` | list own favorites | authenticated | — | app[] | F05 |
| `GET /api/apps/:id/topics` | discussion topics for an app | public | — | topic[] | F06 |
| `POST /api/apps/:id/topics` | start a topic | authenticated | `{title}` | topic | F06 |
| `GET /api/topics/:id/messages` | message history (client also subscribes via Supabase Realtime for live updates) | public | `?cursor=` | message[] | F06 |
| `POST /api/topics/:id/messages` | post a message | authenticated | `{body}` | message | F06 |
| `POST /api/apps/:id/reviews` | submit or edit own review (upsert) | authenticated | `{rating, comment}` | review | F07 |
| `GET /api/apps/:id/reviews` | list reviews | public | `?cursor=` | review[] | F07 |
| `GET /api/users/me` | own profile + stats (uploads/downloads/activity) | authenticated | — | user + stats | S10 |
| `PATCH /api/users/me` | edit display name/avatar | authenticated | `{display_name?, avatar_url?}` | user | S10/S11 |
| `DELETE /api/users/me` | account deletion | authenticated | — | 204 | GDPR |

**Client-only, no route needed:** APK extraction (F04) reads the
device's installed-package list and copies the APK locally via Android's
package manager — it never touches the backend except that the app being
extracted is, by definition, already something the backend doesn't know
about (it's a local file operation, not a store action).

**Background jobs (Inngest):**
- `app_version.uploaded` → call the scanning API → set `scan_status` to `clean` or `flagged`; a version stays hidden from the public feed while `pending`
- nightly `rollup-stats` → refresh any cached counts (download_count, rating_count) if you choose to denormalize those onto `apps` later for feed sorting

**No webhooks in** — no third-party payment or calendar provider to
listen to. The scanning API call above is a job Kitbox's own server
makes outward, not an inbound webhook, unless the vendor you pick only
offers async callback delivery, in which case add one `POST
/api/webhooks/scan-result` with a verified signature and an idempotency
key on `(version_id, provider)` so a redelivered callback doesn't scan
twice.

## Step 4: The parts that bite

- **No in-app update check, by design.** This is the one explicit
  change from the original — build nothing that pings a "latest version"
  endpoint for the Kitbox client itself. New builds ship to the Play
  Store the normal way; the app never nags the user about its own
  version.
- **File size limits.** APK uploads go straight to Supabase Storage via
  a signed upload URL from the client — never proxied through a Vercel
  function, which caps request bodies far below a typical APK's size.
- **Idempotency.** If the scanning vendor delivers results via webhook
  rather than a direct response, the same result can arrive twice — the
  `(version_id, provider)` idempotency key above prevents a double scan
  or a flapping status.
- **Race conditions.** Two simultaneous reviews from the same user:
  handled by the `unique(app_id, user_id)` constraint plus an upsert, not
  app-level "check then write."
- **Rate limits.** Upload and review endpoints need per-user throttling
  (even a simple fixed-window counter in Postgres or Upstash Redis) to
  keep the catalogue from being spammed — the original's community-
  upload model is exactly the kind of surface that gets abused.
- **Search.** Postgres full-text search (the `search_tsv` generated
  column) is enough for an early catalogue; swap for a hosted search
  service only once the catalogue is large enough that relevance
  actually suffers.
- **Realtime.** Supabase Realtime subscribing to the `messages` table
  covers F06 without standing up a separate websocket service.
- **Offline.** The recon flagged "message queued" as an edge case for
  F06 — the mobile client should hold unsent messages (and favorite
  toggles) in local storage and replay them on reconnect, rather than
  silently failing.
- **Trust & safety / malware scanning.** The original's "three
  independent AV engines" is real infrastructure cost; starting with one
  vendor is a deliberate scope cut, written down here so it isn't
  accidentally dropped — see Step 1 and `features.csv`.
- **GDPR-style deletion.** `DELETE /api/users/me` cascades through every
  table via `on delete cascade` — except `apps.owner_id`, which also
  cascades, meaning deleting an account currently deletes every app that
  user uploaded too. Decide before launch whether that's the right
  behaviour or whether uploaded apps should be reassigned/orphaned
  instead (`on delete set null` with an "orphaned" owner state).
- **No multi-tenancy, no time-zone-sensitive logic, no money** — none of
  those original pain points apply here, which is part of why this is an
  M-to-L-sized clone rather than larger.

## Step 5: Build order

**1. Vertical slice** — sign up, see the store feed, open an app, install
it. Proves the stack end to end.
- Screens: S01 splash, S02 store, S04 app details
- Tables: `users`, `apps`, `app_versions`
- Routes: `GET /api/apps`, `GET /api/apps/:id`, `POST /api/apps/:id/download`, Supabase Auth sign-up/sign-in

**2. Must-haves** (from `features.csv`, priority = must):
- Search → S03, `GET /api/apps/search`
- Upload app + metadata form → S06, `POST /api/apps`, `POST /api/apps/:id/versions`, Storage signed uploads
- APK Extractor → S07 (client-only, no new tables/routes)
- Favorites → S08, `favorites` table, `/api/apps/:id/favorite`, `/api/favorites`
- Ratings & reviews → S04/S05, `reviews` table, `/api/apps/:id/reviews`
- Profile (uploads/downloads/activity stats) → S10, `downloads` table, `/api/users/me`
- Dark + light theme → S11, no backend change, token-driven in the client
- No-root constraint → platform-level, affects how S07 is implemented, not a table/route
- **No update-available dialog** → explicitly nothing to build here; confirmed absent from every milestone

**3. Should-haves:**
- Download older version / reinstall → extends S04, uses existing `GET /api/apps/:id/versions`
- Real-time chat/discussions → S09, `topics`/`messages` tables, Supabase Realtime subscription
- Antivirus-style scan of uploads → Inngest job + `scan_status` column (already in schema, wire up the vendor)
- Onboarding / unknown-sources permission explainer → S12, client-only
- Localization beyond the first language → string externalization, add languages incrementally

**4. Could-haves:**
- Global discussion topics → `topics.app_id = null`, same tables/routes as should-have chat
- Push notifications → flagged in recon as unconfirmed/guess; needs its own small design pass before building

**5. The fixes** `replica-entrepreneur` would find (reading real user
reviews of the original for gaps to close) — not run yet; revisit once
that step has.

## Output

`replica/architecture.md` (this file), `replica/schema.sql`.

**Stack in one line:** Expo mobile client + Next.js API on Vercel +
Supabase for Postgres/Auth/Storage/Realtime, Inngest for the scan job.
**7 tables, 17 routes** (plus client-only APK extraction). **Three
riskiest parts:** the malware-scanning pipeline (cost/vendor choice),
realtime chat at scale, and no-root APK extraction across different
Android versions/OEM restrictions.

**Next step:** `/replica-design` to turn `recon.md`'s component list and
`brand.md`'s Kitbox palette into actual design tokens and screens — or
`/replica-launch` first if you'd rather lock the landing page and store
listing before writing any app code.
