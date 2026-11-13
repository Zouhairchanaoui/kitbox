# Components — Kitbox

Icon set: **Lucide** (MIT-licensed, open) — never the original's icon
glyphs. Illustrations for empty states are drawn fresh for Kitbox, not
traced from Appteka's. Font is Inter (open), standing in for whatever
the original ships. All tokens referenced below are role names from
`tokens.json`/`tokens.css` — no raw hex in any component.

Radius is deliberately rounder than the original's mostly-square slab
buttons (see `brand.md`): primary actions use `radius-pill`, cards use
`radius-lg`, inputs and chips use `radius-md`.

---

```
Button (primitive — underlies the Install/Update button below)
  variants  primary (filled accent), secondary (outline, border-input),
            ghost (text only), danger (filled danger)
  sizes     sm 32px, md 40px, lg 48px
  states    default, hover, active (scale .98), focus-visible (2px ring,
            accent, 2px offset), disabled (40% opacity, no pointer events),
            loading (spinner replaces label, label kept for screen readers
            via aria-busy, width does not reflow)
  tokens    bg accent / border-input / transparent per variant,
            text on-accent / text / accent per variant,
            radius pill, font sm/600, padding-x space-4, padding-y space-2
  a11y      real <button> (web) / Pressable with accessibilityRole="button"
            (native); focus ring visible on keyboard nav; loading announces
            "Loading" via accessibilityLiveRegion
  used on   S04, S06, S09 (send), S11 — every screen with a tap action
```

```
App card
  variants  grid (2-col, store feed), list row (search/favorites, full
            width), compact (upload history, no description line)
  sizes     grid: 164×220, list row: full-width × 72, compact: full-width × 56
  states    default, pressed (scale .98, shadow-card → none), loading
            (skeleton — see Skeleton below), long-description truncated
            with ellipsis at 2 lines
  tokens    bg surface, radius lg, shadow card, text text, text-muted for
            byline/category, border none (shadow carries the edge)
  a11y      whole card is one tappable region with a single accessible
            label combining name + rating + category; icon image has
            empty alt (decorative, name already in the label)
  used on   S02, S03, S08, S10
```

```
Install/Update button (Button primitive, primary variant, specialised)
  variants  "Get" (not installed), "Getting it…" (downloading, with
            determinate progress ring replacing the label area),
            "Open" (installed, same version), "Update" (installed, newer
            version available on Kitbox's own catalogue — this is a
            per-app update, not the removed self-update check)
  sizes     sm 32px (on grid/list app cards), md 40px (on S04 app detail)
  states    default, downloading (progress 0–100%, tap cancels), done →
            morphs to "Open", error ("Retry" label, danger-tinted border)
  tokens    bg accent, text on-accent, radius pill; progress ring uses
            on-accent at 30% opacity under, 100% over
  a11y      accessibilityValue reports percent while downloading; state
            change from "Get" to "Open" is announced
  used on   S02 card, S04
```

```
Star rating control
  variants  read-only (display average, supports half-stars), interactive
            (1–5 tap targets, whole stars only)
  sizes     sm 14px stars (card byline), lg 28px stars (S05 picker)
  states    default, selected (fill accent? — no: ratings use warning-gold
            tone, a dedicated non-token star-fill color sits outside the
            semantic palette since a 5-star rating is neither accent nor
            warning in meaning; keep it a literal amber, documented here as
            the one deliberate exception to "no raw hex"), empty, focus-
            visible per star (interactive only)
  tokens    fill: literal amber (not a semantic token, see above), track:
            border, radius n/a (stars, not boxes)
  a11y      interactive variant exposes a single slider-like control
            (accessibilityRole="adjustable") rather than 5 separate
            buttons, so a screen reader user can set a rating in one
            gesture; read-only variant is one label: "4.2 out of 5"
  used on   S02 card (read-only), S04 (read-only), S05 (interactive)
```

```
Category / filter chip
  variants  default (All/Open Source/Exclusive), selected
  sizes     32px tall, auto width + space-3 padding-x
  states    default, selected (bg accent, text on-accent), pressed,
            focus-visible
  tokens    bg surface / accent, text text-muted / on-accent, radius pill,
            border border (default only, selected has none)
  a11y      role="radio" within a role="radiogroup" row (single-select
            filter); horizontal scroll row is keyboard-navigable with
            arrow keys on web
  used on   S02
```

```
Bottom navigation bar
  variants  4 tabs: Store, Favorites, Upload, Profile (Chat/Discussions
            lives inside an app's detail page as a tab, not its own bottom-
            nav slot, per recon's F06 flow — keeps the bar at 4 not 5)
  sizes     56px tall + safe-area inset
  states    active (icon + label in accent, small bar indicator above the
            icon), inactive (icon + label in text-muted), pressed
  tokens    bg bg, active text accent, inactive text text-muted, icon
            size 24px (Lucide), indicator bg accent height 2px radius pill
  a11y      role="tablist"/"tab" with aria-selected; labels always visible
            (not icon-only) for clarity and for screen-reader users
  used on   global (S02, S06, S08, S10)
```

```
Search bar
  variants  idle (placeholder "Search Kitbox"), focused (border → accent),
            with query (clear "x" button appears)
  sizes     44px tall, full width minus space-4 margins
  states    idle, focused, typing, clear
  tokens    bg surface, border border → accent on focus, text text,
            placeholder text-muted, radius md, icon (search, Lucide) in
            text-muted
  a11y      native search input semantics; clear button has an
            accessibilityLabel of "Clear search", not just an icon
  used on   S03
```

```
Message bubble
  variants  sent (own messages, right-aligned), received (left-aligned),
            system (centered, e.g. "topic created")
  sizes     max-width 80% of the chat column, auto height
  states    default, sending (reduced opacity + small spinner corner,
            covers the "queued while offline" case from recon's F06 edge
            case), failed (danger-tinted outline + "Tap to retry")
  tokens    sent: bg accent / text on-accent; received: bg surface / text
            text; system: text text-muted, no bubble fill; radius lg with
            one corner at sm (the "tail" corner, nearest the avatar side)
  a11y      each bubble is one accessible element: "{name} said {body},
            {relative time}"; failed state's retry affordance is reachable
            by keyboard/switch control, not swipe-only
  used on   S09
```

```
Toast / snackbar
  variants  success, error, info, with an optional single action
            ("Undo" on unfavorite — F05's edge case)
  sizes     full-width minus space-4 margins, auto height, min 48px
  states    entering (slide up + fade, motion-base), visible (auto-
            dismiss 4s unless it has an action, then 8s), exiting
  tokens    success: border-l success / bg surface; error: border-l
            danger / bg surface; info: border-l accent / bg surface;
            radius md, shadow pop
  a11y      posted to an assertive live region on appearance; auto-
            dismiss is paused while the toast has focus or is being read
            by a screen reader
  used on   global (after F03 upload, F05 favorite/unfavorite, F07
            review submit, any failed request)
```

```
Settings switch row
  variants  single row (label + switch), row with a secondary description
            line (e.g. "Dark mode" / "Matches your device by default")
  sizes     min 48px tall (touch target), full width
  states    off, on (track → accent, thumb → on-accent), pressed,
            focus-visible, disabled
  tokens    track off: border-input at 40%, track on: accent, thumb:
            bg (always), radius pill (track), text text / text-muted
            (secondary line)
  a11y      role="switch" with aria-checked; whole row (not just the
            switch control) is tappable, per standard mobile-settings
            convention
  used on   S11
```

```
Empty state (illustration + text)
  variants  no favorites (S08), no search results (S03), no messages yet
            (S09), offline/can't reach Kitbox (S02), upload history empty
            (S10)
  sizes     centered in the available content area, illustration 120×120
  states    static (no interaction states — it's a dead end with a next
            action, not a control)
  tokens    illustration: fresh line-art in accent + surface (never
            Appteka's artwork), heading text/lg/600, body text-muted/sm,
            optional CTA button below (Button primitive, secondary variant)
  a11y      illustration is decorative (empty alt); heading is the
            accessible heading for the region so a screen reader
            announces the empty state's cause, not just "no items"
  used on   S02, S03, S08, S09, S10
```

```
Progress / loading skeleton
  variants  list skeleton (stack of card-shaped placeholders), spinner
            (inline, for buttons and small regions)
  sizes     skeleton matches the real component's box exactly (App card
            grid/list dimensions) so layout doesn't jump on load
  states    pulsing shimmer (motion-base loop), replaced by real content
            or by an empty state once the request resolves
  tokens    bg surface with a lighter shimmer sweep at 60% opacity,
            radius matches the component it's standing in for
  a11y      accessibilityLabel "Loading" on the container; content swap
            on arrival is not announced mid-stream to avoid chat-spamming
            a screen reader during a fast load
  used on   S02 (first load), S03 (searching), S04 (opening), S09
            (loading message history)
```

## Step 4 — build the primitives

Not built yet. Once the Expo project scaffold exists (first task of
`/replica-build`'s vertical slice), build each block above as its own
component file under `components/`, render them all on one internal
`/design` screen (every variant, every state, side by side), and
screenshot that screen — that screenshot is the design-system check
before any real app screen gets built.

## Output

`tokens.json`, `tokens.css` (light + dark, 0 AA failures — 10 pairs
checked), `tailwind.config.js` (NativeWind mapping, no raw hex anywhere),
and this file, 11 components specified with every state the recon saw
plus focus/disabled/loading/error/empty. Primitives not yet built in
code.

**Next:** `/replica-build` to scaffold the Expo project and build these
primitives for real, starting with the vertical slice from
`architecture.md`.
