---
name: Foundation
description: A project-agnostic visual system built on strict spacing, alignment, and hierarchy rules.
colors:
  ink-950: "#0C0D0E"
  ink-800: "#1F2124"
  ink-600: "#4A4E54"
  ink-500: "#6B7076"
  line-200: "#E3E5E8"
  line-100: "#EFF1F3"
  surface-50: "#F7F8F9"
  surface-0: "#FFFFFF"
  accent: "#2340B8"
  accent-hover: "#1B3494"
  accent-light: "#8AA4FF"
  success: "#0F7A52"
  warning: "#A15C00"
  danger: "#B3261E"
typography:
  display:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.5vw, 2.375rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Switzer, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
rounded:
  none: "0px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "9999px"
spacing:
  "3xs": "2px"
  "2xs": "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
  "4xl": "96px"
  "5xl": "128px"
  "6xl": "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink-950}"
    textColor: "{colors.surface-0}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.surface-0}"
  button-secondary:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.ink-950}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-50}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-600}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink-950}"
  input:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.ink-950}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.lg}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.surface-50}"
    textColor: "{colors.ink-600}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "28px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-600}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "36px"
---

# Design System: Foundation

## Overview

**Creative North Star: "The Instrument Panel"**

A well-made instrument earns trust before it says anything: parts sit on a grid, edges meet exactly, nothing is decorated to look serious. This system is built the same way. Structure carries the meaning — spacing, alignment, and weight do the work that gradients, shadows, and card borders do in a weaker system. Color is functional almost everywhere; it appears when something is interactive, selected, or wrong, and stays out of the way otherwise.

The system is deliberately project-agnostic. It fixes the invariants an implementer should never have to decide — the spacing scale, the grid, the type ramp, contrast floors, elevation doctrine, state coverage — and leaves exactly one slot open for identity: the accent hue. A project pins that slot, and everything else stays as written. This is why the same rules produce a documentation site, a dashboard, and a marketing page without any of them looking like the same template.

The intended feel is quiet and exact rather than expressive. If a screen built on this system looks impressive, it should be because the hierarchy is obvious at a squint and the alignment holds everywhere, not because anything was added.

**Key Characteristics:**
- One 4px-based spacing scale, used everywhere; no arbitrary values.
- Neutral-plus-one-accent palette; chromatic color is reserved for interaction and status.
- Flat by default — depth is a response to state, never a resting decoration.
- Type hierarchy comes from size and weight steps that are obvious without measuring.
- Every interactive element ships hover, focus-visible, active, disabled, loading, error, and empty states.
- Identical layout logic across desktop, tablet, and mobile; only density and column count change.

## Colors

A cool-neutral ink ramp carries all structure and text; a single deep-blue accent carries interaction; three status hues carry meaning that must not be missed.

### Primary

- **Ink** (`ink-950`): the primary action color and the strongest text. Primary buttons are ink, not accent — this keeps the accent rare enough to mean something. Contrast on white ≈19:1.
- **Cobalt** (`accent`): interactive text, links, focus rings, selected state, and progress. Contrast on white ≈8.5:1, so it is safe for body-size text, not only for large text.
- **Cobalt Deep** (`accent-hover`): the pressed and hovered state of accent-colored text and fills.
- **Cobalt Light** (`accent-light`): the dark-mode substitute for `accent`. Contrast on `ink-950` ≈8.2:1. Never use it on a light surface.

### Secondary

None. This system has one accent by design. A project that needs a second chromatic voice should extend the ramp deliberately rather than borrowing a status color, which would make status ambiguous.

### Neutral

- **Ink 950** (`ink-950`): headings, primary body text, primary button fill.
- **Ink 800** (`ink-800`): default body text inside cards and dense regions. Contrast on white ≈16:1.
- **Ink 600** (`ink-600`): secondary text, nav links at rest, supporting copy. Contrast on white ≈8.4:1.
- **Ink 500** (`ink-500`): the lightest text tone permitted anywhere — captions, helper text, placeholders. Contrast on white ≈5:1. There is no lighter text token, deliberately.
- **Line 200** (`line-200`): borders on inputs, cards, and dividers that need to be seen.
- **Line 100** (`line-100`): hairline dividers inside a group, where the separation is a whisper.
- **Surface 50** (`surface-50`): recessed and hovered surfaces, table header rows, code blocks.
- **Surface 0** (`surface-0`): the base page and card surface in light mode.

### Status

- **Success** (`success`): confirmation and valid state. Contrast on white ≈5.3:1.
- **Warning** (`warning`): caution that does not block. Contrast on white ≈5.2:1.
- **Danger** (`danger`): errors, destructive actions, blocking problems. Contrast on white ≈6.5:1.

Each status hue is chosen dark enough to be used as *text*, not only as a background tint. A status color that only works as a 10%-opacity fill forces implementers to invent a darker variant, and invented variants are where palettes rot.

### Named Rules

**The Placeholder Floor Rule.** Placeholder and helper text use `ink-500` or darker — never lighter. Placeholder text is real text a user must read; the common practice of setting it to a 2.5:1 gray is an accessibility failure, not a style. Nothing in this system is lighter than `ink-500` on a light surface.

**The Rare Accent Rule.** The accent covers no more than roughly 10% of any screen. Primary actions are ink; the accent marks what is *interactive or currently selected*. When the accent starts appearing on decorative surfaces, it stops reading as "you can act here," and every affordance on the page gets quieter.

**The Never-Gray-on-Color Rule.** Secondary text on a colored or dark surface is tinted from that surface's own hue, never set in neutral gray. Gray on color reads as dirty and breaks the contrast assumption the ramp was built on.

**The Dark Is Not Black Rule.** Dark mode's base is `ink-950`, never `#000`. Elevation in dark mode is expressed by stepping surfaces *lighter* (`ink-950` → `ink-800` → a lighter step), because shadows are close to invisible on a dark ground. Do not port the light-mode shadow tokens into dark mode.

## Typography

**Display / Body / UI Font:** Switzer (fallback: `ui-sans-serif`, `system-ui`, `sans-serif`)
**Reading Font (optional register):** Source Serif 4 (fallback: `Georgia, serif`)
**Mono Font:** JetBrains Mono (fallback: `ui-monospace, monospace`)

**Character:** One grotesque carries display, UI, and body. Switzer has enough character at display sizes to avoid looking like a default system stack, and stays neutral enough at 16px to disappear into reading. Using a single family across the whole ramp is the restrained choice — hierarchy comes from disciplined size and weight steps, not from a second typeface hired to create contrast the scale should have produced.

Source Serif 4 is an *optional* second register, and only for long-form reading surfaces (articles, documentation prose). A project with no long-form reading should not load it.

Self-host all faces as subset WOFF2 with `font-display: swap`, and preload only the weights used above the fold. Verify each face's current license before shipping — Source Serif 4 and JetBrains Mono are under the SIL Open Font License; Switzer is distributed by Fontshare under its own terms, which must be checked at integration time rather than assumed.

### Hierarchy

- **Display** (600, `clamp(2.75rem, 6vw, 4.75rem)`, line-height 1.02, tracking -0.03em): one per page, at most. The page's thesis. Never used for a section heading.
- **Headline** (600, `clamp(1.875rem, 3.5vw, 2.375rem)`, line-height 1.12, tracking -0.02em): section headings.
- **Title** (550, 20px, line-height 1.3, tracking -0.01em): card headings, dialog titles, subsection headings.
- **Body** (400, 16px, line-height 1.6): all prose. Measure capped at 65–75 characters.
- **Body Small** (400, 14px, line-height 1.55): dense regions, table cells, secondary descriptions.
- **Label** (500, 13px, line-height 1.4, tracking +0.01em): buttons, nav, form labels, chips, table headers.
- **Caption** (400, 12px, line-height 1.4, color `ink-500`): timestamps, helper text, footnotes.
- **Mono** (400, 14px, line-height 1.55): code, identifiers, and numeric data only.

Weights in use: 400, 500, 550, 600. Four weights is the whole system. Do not introduce 300 (fails at small sizes) or 700+ (the 600 display weight already carries the top of the ramp; 800 reads as shouting).

### Named Rules

**The Measure Rule.** Body text is capped at 65–75 characters per line (`max-width: 68ch` is the practical default). This cap applies inside cards, modals, and wide desktop layouts too — a full-width paragraph on a 1440px screen is unreadable no matter how good the type is.

**The Tracking Floor Rule.** Negative tracking stops at -0.03em, and only on Display and Headline. Body, Label, and anything under 20px gets 0 or slightly positive tracking. Tightening small text to look "designed" costs legibility and gains nothing.

**The Two-Step Rule.** Adjacent levels in the hierarchy differ by an obvious size step, a weight step, or both — never by 2px alone. If two text levels have to be measured to be told apart, they are the same level and one of them should be deleted.

**The Mono Is Not A Costume Rule.** Monospace marks code, identifiers, keys, and figures meant to be compared column-to-column. It is never used for labels, eyebrows, or captions to make an interface look technical. Numeric data in tables uses `font-variant-numeric: tabular-nums` in the body face rather than switching to mono.

## Layout

**The spacing scale is the whole system.** Every margin, padding, and gap resolves to a token from `spacing`. There are no arbitrary pixel values, and no value between tokens. A 4px base is used rather than an 8px base because the intermediate steps (4, 12) are exactly the ones that dense UI needs and an 8-only scale forces you to fake.

**Baseline grid.** All vertical spacing is a multiple of 4px. Component heights are multiples of 4px (28, 32, 36, 40, 48). This is what makes unrelated components sit correctly beside each other without per-instance nudging.

**Grid and containers.**

| Breakpoint | Min width | Columns | Gutter | Side padding | Container max |
|---|---|---|---|---|---|
| Mobile | 0 | 4 | `md` (16px) | `md` (16px) | fluid |
| Tablet | 768px | 8 | `lg` (24px) | `lg` (24px) | fluid |
| Desktop | 1024px | 12 | `lg` (24px) | `xl` (32px) | 1280px |
| Wide | 1440px | 12 | `lg` (24px) | `2xl` (48px) | 1280px |

Content stops at 1280px. Only full-bleed surfaces (page background, hero media, sticky bars) extend past it. Reading columns stop far earlier, at the measure cap.

**Vertical rhythm.**

- Between major page sections: `4xl` (96px) desktop, `3xl` (64px) tablet, `2xl` (48px) mobile.
- Between subsections within a section: `2xl` (48px) desktop, `xl` (32px) mobile.
- Between a paragraph and the next: `md` (16px).
- Between tightly related items (label→input, icon→text, title→subtitle): `2xs`–`xs` (4–8px).
- Inside a card: `lg` (24px) padding desktop, `md` (16px) mobile.

**Density.** Marketing and reading surfaces use the generous end of each range. Dense operational surfaces (tables, dashboards, editors) shift one step down the scale uniformly — `lg` becomes `md`, `xl` becomes `lg` — rather than being spaced by hand. Changing density means changing one multiplier, not editing components.

**Responsive logic is structural, not cosmetic.** The same rules apply at every size: what collapses is decided by what stays important. Multi-column grids reflow to a single column; horizontal nav collapses to a disclosure; sidebars move below content or behind a trigger; tables scroll horizontally within their container rather than shrinking their type. Type sizes below Headline do not shrink on mobile — 16px body stays 16px, because shrinking body text to fit is solving a layout problem in the wrong place.

**Alignment.**

- One left rail per column. Headings, body, and controls in the same column share an exact left edge, across sections. This single rule does more visible work than any other in the document.
- Optical alignment overrides mathematical alignment for circles, triangular glyphs, quotation marks, and icons beside text. Correct by eye against the rendered result, then record the offset as a component-level constant so it is not re-derived.
- Icons align to the cap-height of adjacent text, not to its bounding box or baseline.
- Numeric columns are right-aligned with tabular figures; text columns are left-aligned. Never center a data column.
- Centered text is permitted only for single-line headings and labels in a deliberately symmetric composition. Body paragraphs, form labels, and anything over two lines are always left-aligned.

### Named Rules

**The Heading Space Rule.** The space above a heading is at least twice the space below it. A heading belongs to the content that follows it, and equal spacing on both sides makes it float between two blocks, belonging to neither. This is the most frequently violated rule in this document and the fastest way to spot a layout that was not built on a system.

**The Proximity-Before-Container Rule.** Group by spacing first. Reach for a card, border, or background tint only after proximity alone has failed. Most cards in most interfaces exist to compensate for spacing that was never tuned — and once a card exists, the spacing inside it never gets fixed.

**The Rhythm Rule.** Spacing alternates deliberately between tight and generous. If a screen uses the same interval between every pair of elements, everything on it has equal weight, which means it has no hierarchy at all. A dense passage earns a quiet one.

**The Touch Target Rule.** Every interactive element has a hit area of at least 44×44px, regardless of how small its visible mark is. Expand the hit area with padding or a pseudo-element; never enlarge the icon to reach the minimum.

## Elevation & Depth

**This system is flat at rest.** Separation between surfaces at rest is expressed by a tonal step (`surface-0` against `surface-50`) or a single hairline (`line-200`) — not by a shadow. Shadows appear only when something has genuinely left the page plane: a menu, a popover, a dialog, a dragged item, a sticky bar that has begun to overlap content.

### Shadow Vocabulary

- **Raised** (`box-shadow: 0 1px 2px rgba(12,13,14,0.06), 0 2px 8px rgba(12,13,14,0.06)`): hover state on an interactive card, sticky headers once scrolled.
- **Overlay** (`box-shadow: 0 4px 8px rgba(12,13,14,0.06), 0 12px 24px rgba(12,13,14,0.10)`): dropdowns, popovers, tooltips, comboboxes.
- **Dialog** (`box-shadow: 0 8px 16px rgba(12,13,14,0.08), 0 24px 48px rgba(12,13,14,0.14)`): modals and sheets, over a `rgba(12,13,14,0.40)` scrim.

Every shadow carries a vertical offset and a soft blur, in two layers — a tight contact shadow and a diffuse ambient one. This is what makes depth read as light falling on an object rather than as a graphic effect applied to a box.

**Focus ring** (`box-shadow: 0 0 0 2px {colors.surface-0}, 0 0 0 4px {colors.accent}`): applied on `:focus-visible` only, so pointer users never see it and keyboard users always do. The inner white ring keeps the accent legible against any surface. The focus ring is the one place a shadow appears on an otherwise-flat element, and it is never removed, never replaced with a color change alone, and never suppressed for aesthetics.

### Named Rules

**The One Elevation Signal Rule.** Declare depth once per element: a border *or* a shadow, never both. A 1px border sitting under a wide soft shadow is the ghost card — the two signals fight, and the result reads as a component that could not decide what it was. Cards use a border in flat regions and a shadow in floating ones.

**The No Resting Shadow Rule.** A shadow at rest is decoration. If every card on a page is elevated, nothing is elevated. Shadows respond to state — hover, focus, overlay, drag — and disappear the moment that state ends.

## Shapes

Corners are quietly rounded, and the radius scales with the element's size so that curvature reads as consistent rather than as five different decisions.

- **Small controls** (`sm`, 6px): inputs, selects, checkboxes, small buttons, code blocks, table cells.
- **Buttons** (`md`, 10px): standard and large buttons, segmented controls.
- **Containers** (`lg`, 14px): cards, panels, popovers, dialogs, images, media.
- **Large surfaces** (`xl`, 20px): full-bleed feature panels and hero containers only.
- **Pills** (`full`): reserved for elements 32px tall or shorter — chips, tags, avatars, toggles, badges, counters.

Nested radii are computed, not guessed: an inner element's radius equals the outer radius minus the padding between them, floored at `sm`. A 14px card with 24px padding holds a 6px inner control — not another 14px curve, which would read as concentric and loose.

Borders are 1px and use `line-200`. There is exactly one border width in this system.

### Named Rules

**The Pill Ceiling Rule.** Fully-rounded corners are for controls 32px tall or shorter. A full-radius button at 48px tall reads as a capsule advertisement, not a control; large elements use `md` or `lg`.

**The No Nested Card Rule.** A card never contains another card. If content inside a card needs its own container, the outer card is doing too much and should be split into siblings.

## Components

Sizing is uniform across every control type, which is what lets a button, an input, and a select sit in one row without adjustment.

**Control heights:** small 32px, medium 40px (default), large 48px.
**Icon sizes:** 16px inline, 20px default, 24px navigation and empty states. One icon library, one stroke width (1.5px), one corner style, across the entire product.

### Buttons

- **Shape:** softly rounded (`md`, 10px), height 40px, horizontal padding 20px, label typography, no letter-spacing tricks.
- **Primary:** ink fill, white label. One primary action per view — if two exist, one of them is secondary.
- **Secondary:** white fill, ink label, 1px `line-200` border.
- **Ghost:** transparent, `ink-600` label; for tertiary and toolbar actions.
- **Destructive:** `danger` fill with white label for confirmed destructive actions; `danger` label on transparent for the trigger that opens the confirmation.
- **Hover:** background darkens one step; 120ms transition. **Active:** no translation, no scale — the color step is the feedback. **Focus-visible:** the focus ring. **Disabled:** `surface-50` fill, `ink-500` label, `cursor: not-allowed`, no hover response. **Loading:** a spinner replaces the label, the button keeps its exact width, and the control is `aria-busy`.
- Icon-only buttons are square at the control height, carry an `aria-label`, and get a tooltip.

### Inputs and Fields

- **Style:** white fill, 1px `line-200` border, `sm` (6px) radius, 40px height, 12px horizontal padding, body typography at 16px. 16px is a hard minimum on mobile — anything smaller triggers iOS zoom on focus.
- **Label:** always visible, above the field, `xs` (8px) below it, label typography, `ink-800`. Placeholders are never used as labels.
- **Focus:** border becomes `accent`, plus the focus ring. **Error:** border becomes `danger`, with a message below in `danger` at caption size, `2xs` (4px) beneath the field, referenced by `aria-describedby`. **Disabled:** `surface-50` fill, `ink-500` text.
- Helper text sits below the field in `ink-500` caption; error text replaces it rather than stacking.

### Cards and Containers

- **Radius:** `lg` (14px). **Padding:** `lg` (24px) desktop, `md` (16px) mobile. **Background:** `surface-0`.
- **Elevation:** a 1px `line-200` border at rest. Interactive cards gain the *Raised* shadow and drop the border on hover — never both at once.
- Internal rhythm: title to body `xs` (8px); body to actions `lg` (24px).

### Navigation

- Nav links use label typography in `ink-600` at rest, `ink-950` on hover, and `ink-950` with a 2px `accent` underline or left rule when active. The active state is never signaled by color alone.
- Header height 64px desktop, 56px mobile. Flat at rest; gains the *Raised* shadow only once the page has scrolled.
- Mobile nav collapses to a disclosure that opens a full-height sheet, with focus trapped inside it and restored to the trigger on close.

### Chips and Tags

- Full radius, 28px height, 12px horizontal padding, `surface-50` fill with `ink-600` label. Selected state: `accent` label on a tinted accent fill, plus a check icon — never fill alone.

### Tables

- Header row: label typography, `ink-600`, `surface-50` background, sticky on scroll. Cells: body-small, `lg` horizontal padding, 44px minimum row height. Row separators: `line-100`. Numeric columns right-aligned with tabular figures. Zebra striping is not used; the hairline is enough.

### Motion

One authored moment per view, not an entrance animation on every section.

- **Durations:** 120ms (color and micro-state), 180ms (default transitions), 240ms (popovers, disclosure), 320ms (dialogs, sheets, page-level transitions).
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — an exponential ease-out — for anything entering or expanding. `cubic-bezier(0.4, 0, 1, 1)` for anything leaving.
- Animate `transform`, `opacity`, `filter`, and `clip-path`. Never animate `width`, `height`, `top`, or `left`.
- Content is visible by default and animates *from* a visible state. Nothing is hidden at `opacity: 0` waiting for a scroll listener — a failed observer must never leave the page blank.
- `@media (prefers-reduced-motion: reduce)` collapses every duration to ~1ms and removes all transform-based motion, keeping opacity changes only.

### Required States

Every component ships all of these before it is considered done: **default, hover, focus-visible, active, disabled, loading, error, empty**. An empty state names what is missing and offers the action that fills it. An error state names the problem and the recovery, in the product's own language — never a status code alone.

## Do's and Don'ts

### Do

- **Do** resolve every margin, padding, and gap to a `spacing` token. A one-off `padding: 18px` is the first crack in the system.
- **Do** put at least twice as much space above a heading as below it.
- **Do** cap body text at 65–75 characters, in every container, at every width.
- **Do** group with proximity before reaching for a card, border, or tint.
- **Do** declare depth once per element — a border or a shadow, never both.
- **Do** keep placeholder and helper text at `ink-500` or darker.
- **Do** pair every status color with an icon and a word, so meaning never depends on color perception alone.
- **Do** give shadows a vertical offset and a soft blur, in two layers.
- **Do** compute nested radii as outer radius minus padding.
- **Do** use `:focus-visible` for focus rings, and never remove them.
- **Do** keep 16px as the minimum input font size on mobile.
- **Do** ship hover, focus, active, disabled, loading, error, and empty for every interactive component.
- **Do** align icons to the cap-height of adjacent text and correct optically against the rendered result.

### Don't

- **Don't** use gradients as surfaces or backgrounds. Gradient *text* is banned outright — emphasis comes from weight and size.
- **Don't** build a page whose structure is a grid of same-size cards each holding an icon, a heading, and three lines of text. That arrangement is the default that signals no decision was made.
- **Don't** nest a card inside a card.
- **Don't** put a kicker or eyebrow label above a heading. The heading carries its own weight.
- **Don't** number sections (01 / 02 / 03) unless the sequence itself is information the reader needs.
- **Don't** use glassmorphism, backdrop blur, or translucency as decoration. Backdrop blur is legitimate only where content genuinely scrolls beneath a fixed surface.
- **Don't** apply a resting shadow to cards, or stack more than the three defined elevation levels.
- **Don't** use a colored `border-left` or `border-right` thicker than 1px on cards, callouts, or alerts.
- **Don't** use hard offset shadows (`box-shadow: 4px 4px 0`). A zero-blur block shadow is a costume from a different design world.
- **Don't** use emoji or Unicode glyphs as icons. Icons are drawn, from one library, at one stroke width.
- **Don't** introduce a color outside the palette — including "just this once" for an illustration, a chart series, or a marketing section. Extend the ramp deliberately or use what exists.
- **Don't** set body text larger than 18px or display text larger than 96px (6rem). Oversized type is not hierarchy; it is the absence of it.
- **Don't** tighten tracking past -0.03em, or apply negative tracking to anything under 20px.
- **Don't** center body paragraphs, form labels, or any text block over two lines.
- **Don't** shrink body text to make a mobile layout fit. Reflow the structure instead.
- **Don't** use monospace to make something look technical.
- **Don't** add decorative stripes, dot grids, noise, or `feTurbulence` texture to a background. Backgrounds are surfaces.
- **Don't** use sparklines, progress rings, or soft-shadowed rounded rectangles as filler where real content belongs.
- **Don't** animate an element's entrance on every section, and never hide content at `opacity: 0` pending a scroll trigger.
- **Don't** pick dark mode because the product is technical, or light mode because it is friendly. Choose from the real use scene — who uses this, where, under what ambient light — and record the reason.

---

## Implementation notes

This file is the normative source. The YAML frontmatter carries the tokens; the prose explains where and why they apply, and never restates a token value with a different number.

**Filling the identity slot.** The one open decision is the accent hue. A project replacing `accent` must satisfy: ≥4.5:1 against `surface-0` at body size, ≥3:1 against `surface-50`, a `accent-hover` one step darker, and an `accent-light` variant ≥4.5:1 against `ink-950` for dark mode. Everything else in the system stays as written.

**What this file deliberately does not decide.** It sets no page compositions, no hero structures, no section order, and no illustration or photography direction. Those belong to a surface-level brief, because they depend on what the site is for. A system that dictated composition would produce the template-like sameness this document exists to prevent.

**Verification.** Before a surface ships, check the built result — not the intention — against: contrast ratios at every text size, the computed spacing values (read them, don't eyeball them), real copy at every breakpoint, keyboard-only operation through the whole flow, and all eight required states on every interactive component.
