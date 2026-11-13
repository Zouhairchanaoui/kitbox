# Brand — Appteka clone rebrand

## Step 1–2: Name candidates and checks

20 candidates generated across styles, cut to 5 after a first screening
(ruled out for a real conflict found in a plain web search, done today):

- ~~Opencrate~~ — too close to an existing open-source project "OpenCrates"
- ~~Velto~~ — an existing Android app and a Rust web framework both already use this exact name
- ~~Loomkit~~ — an existing Apple-platform networking library is called exactly "LoomKit"
- Appcrate, Nuvex, Kaddo, Drovo, Pathdrop, Boxdrift, Fetchly, Stashkit, Driftcrate,
  Sharehive, Crateful, Stackhive, Kitbox, Driftkit, Hivedrop, Appnest, Opendrove — screened, no obvious conflict found

**Final 5, with the checks table.** "Run" = I ran a plain web search today
(2026-11-13) and found no obvious conflicting app/brand. The rows marked
**to run** are the real clearance checks — official trademark databases,
exact app-store search, domain registration, and social handles — and
need a human (ideally a trademark lawyer for the legal ones) to actually
do them before you commit. A clean plain-web-search is a screen, not a
clearance.

### 1. Kitbox
*compound — a small toolkit you carry apps in*
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US trademark (tmsearch.uspto.gov, classes 9 & 42) | to run |
| EU trademark (euipo.europa.eu) | to run |
| Canada (ised-isde.canada.ca) | to run |
| WIPO Global Brand Database | to run |
| domain (kitbox.app / kitbox.io / kitbox.store) | to run |
| App Store / Play Store exact search | to run |
| handles (X, Instagram, TikTok, GitHub) | to run |

### 2. Stackhive
*compound — a hive of stacked apps*
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US / EU / Canada / WIPO trademark | to run |
| domain | to run |
| store listing exact search | to run |
| handles | to run |

### 3. Driftkit
*compound — light, easy, drifts onto your phone*
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US / EU / Canada / WIPO trademark | to run |
| domain | to run |
| store listing exact search | to run |
| handles | to run |

### 4. Hivedrop
*compound — apps dropped into a shared hive*
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US / EU / Canada / WIPO trademark | to run |
| domain | to run |
| store listing exact search | to run |
| handles | to run |

### 5. Nuvex
*invented — short, neutral, no built-in meaning to fight*
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US / EU / Canada / WIPO trademark | to run |
| domain | to run |
| store listing exact search | to run |
| handles | to run |

None of the 5 sound, look, or mean anything like "Appteka" — no pharmacy
pun, no "-teka" echo, no shared initials.

**→ Chosen name: Kitbox.** Locked in `brand.json`. The official checks
below are still marked **to run** — do them (or have a trademark lawyer
run the legal ones) before you commit money or launch anything under
this name.

### Kitbox — outstanding checks to run
| check | status |
| --- | --- |
| web search (2026-11-13) | no conflicting app/brand found |
| US trademark (tmsearch.uspto.gov, classes 9 & 42) | to run |
| EU trademark (euipo.europa.eu) | to run |
| Canada (ised-isde.canada.ca) | to run |
| WIPO Global Brand Database | to run |
| domain (kitbox.app / kitbox.io / kitbox.store) | to run |
| App Store / Play Store exact search | to run |
| handles (X, Instagram, TikTok, GitHub) | to run |

## Step 3: Palette

New hue family entirely — the original's accent is green (`#32A304`);
this one is violet, nowhere near it:

| token | value | role |
| --- | --- | --- |
| accent | `#6D28D9` | primary buttons, links, active states |
| on-accent | `#ffffff` | text/icons on accent |
| bg | `#ffffff` | page background |
| surface | `#f5f3fb` | cards, sheets |
| border | `#e2ddf2` | dividers, card edges |
| text | `#1c1830` | body text |
| text-muted | `#5e5774` | secondary text |
| danger | `#c6283f` | errors, destructive actions |
| success | `#1f7a63` | confirmations |

Contrast check (`contrast.py`) on `replica/design/tokens.json`: **9 pairs,
0 failing AA** (several hit AAA). Button and card corners are also
reshaped from the original — radius tokens moved from a tighter, mostly-
square look to a softer `sm:8 / md:14 / lg:22 / pill:999`, so buttons read
as pill-shaped rather than the slab-rectangle buttons in the original's
screenshots.

## Step 4: Logo brief

*(idea, not a finished logo — for whoever draws it: you, a designer, or
an image model)*

- **Idea:** since the app's core loop is apps flowing in and out of a
  shared pool, the mark should read as "things gathering/flowing into a
  container" — not a pharmacy cross, not a shopping bag (avoids both the
  original's own mark and generic app-store cliché).
- **Mark type:** symbol + wordmark lock-up (a simple abstract container/
  flow glyph, set next to the wordmark), with a monogram-only version for
  small spaces.
- **Must work at:** 16px (favicon, legible as a single blob of color) and
  as a 1024×1024 app icon (opaque background, no transparency, safe-zone
  margin per Android/iOS icon guidelines).
- **Deliverables:** SVG master, 1024×1024 PNG app icon, favicon set
  (16/32/48/180px), social share image 1200×630.
- **Must not resemble the original's mark:** Appteka's icon is a stylised
  green pill/capsule shape (pharmacy reference) in a rounded square tile.
  The new mark must share no silhouette, no pill/capsule shape, no green,
  and no rounded-square tile treatment with a single bold color fill —
  pick a genuinely different container metaphor (e.g. a hex/hive cell, an
  open bracket, a drip/drop shape) and a different tile shape (e.g.
  squircle with a different corner radius, or no tile at all).

## Step 5: Voice

Three words: **plain, quick, unpretentious** — not childish, not
corporate.

| do | don't |
| --- | --- |
| "Add it" | "Initiate installation" |
| "Nothing here yet" | "No results found. Please try again." |
| "Shared." | "Your upload has been successfully submitted!" |
| "Couldn't send that — try again" | "An error occurred" |
| short, one clause | stacked clauses, passive voice |

Ten most-seen strings (name locked in as **Kitbox**):

1. Primary CTA on an app card: **"Get"**
2. Download in progress: **"Getting it…"**
3. Already installed: **"Open"**
4. Empty store feed (offline): **"Can't reach Kitbox right now"**
5. Empty search results: **"Nothing matches that"**
6. Empty favorites: **"Nothing saved yet"**
7. Upload submit button: **"Share it"**
8. Upload success: **"Shared."**
9. Review submit: **"Post"**
10. Generic error toast: **"Didn't go through — try again"**

All fresh wording — none of it echoes the original's phrasing or tone.

## Step 6: The sweep

No app code exists yet (we're still at the brand/design-token stage), so
there's nothing to sweep for leftovers today. Once `replica-build` starts
writing actual files, run:

```bash
python3 "/mnt/skills/plugins/replica-skill:replica-brand/sweep.py" . --config replica/brand.json
```

against the real project folder before every release. It checks file
contents and file names for "Appteka," "Appsend," "tomclaw," and
`#32A304` (also inside identifiers like `AppsendClient`), skipping
`node_modules`, build output, and the `replica/` planning folder itself —
which is why this recon/brand documentation, with "Appteka" written all
over it as the reference point, is fine to keep as-is; it's the shipped
app code it must never appear in.

## Output

This file, `replica/brand.json` (`chosen_name: "Kitbox"`),
`replica/design/tokens.json` (new palette, 0 AA failures), logo brief,
and the 10 rewritten strings above, all using **Kitbox**.

**Next:** run the outstanding "to run" checks above on Kitbox before
committing to it publicly, hand the logo brief off for actual artwork
(you, a designer, or an image model), then `/replica-launch` for the
landing page, pricing, and store listing.
