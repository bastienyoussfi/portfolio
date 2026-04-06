# Bastien Yoússfi — Design System

> **Codename:** Elevation
> **Aesthetic:** Native-grade, Apple-informed, obsessively restrained.
> **Philosophy:** Expensive through absence. Every pixel earns its place.

---

## 1. Design Principles

These are non-negotiable. Every component, every decision filters through them.

**Depth without weight.** Use layered surfaces (card → well → nested well) to create visual hierarchy. Never use drop shadows as decoration — they exist only to separate planes. A card sits on the page. A well sits inside the card. That's the depth model.

**Restraint is the feature.** One accent color per context. One font weight shift per hierarchy level. One animation per interaction. If you're adding something, ask what you're removing.

**Native feel.** This should feel like it shipped with the OS. That means: system-consistent border radii, optically aligned spacing, familiar interaction patterns (iOS list rows, segment controls, toggles), and transitions that feel physical — spring curves, not linear.

**Information density over decoration.** Real data, real metrics, real timestamps. Every card should communicate something. No placeholder illustrations, no decorative blobs, no gradient meshes. The content IS the design.

**Typography does the heavy lifting.** The contrast between a 200-weight 42px number and a 700-weight 10px caps label creates more visual interest than any gradient ever could.

---

## 2. Color Tokens

### Surfaces

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f2f2f7` | Page background. iOS system gray 6. |
| `--card` | `#ffffff` | Primary card surface. |
| `--well` | `#f9f9fb` | Inset container inside cards. |
| `--well-2` | `#f4f4f8` | Deeper inset, image placeholder zones. |

### Text

| Token | Value | Usage |
|---|---|---|
| `--text-1` | `#1c1c1e` | Primary text. Headlines, names, values. |
| `--text-2` | `#3a3a3c` | Body text, secondary labels. |
| `--text-3` | `#8e8e93` | Captions, metadata, timestamps. |
| `--text-4` | `#c7c7cc` | Tertiary: placeholders, disabled, borders. |
| `--text-5` | `#d5d5da` | Chevrons, decorative text (large quote marks). |

### Borders & Fills

| Token | Value | Usage |
|---|---|---|
| `--sep` | `rgba(60, 60, 67, 0.06)` | Hairline separators. Always 0.5px. |
| `--fill-1` | `rgba(120, 120, 128, 0.08)` | Button backgrounds, segment tracks, tag fills. |
| `--fill-2` | `rgba(120, 120, 128, 0.05)` | List row hover state. |
| `--fill-3` | `rgba(120, 120, 128, 0.03)` | Subtle surface tint. |

### Accent Palette

Each accent has a paired light variant for background tinting. Accents are **semantic** — they carry meaning, not decoration.

| Token | Value | Light variant | Semantic use |
|---|---|---|---|
| `--blue` | `#007aff` | `rgba(0,122,255,0.08)` | Interactive, links, primary actions |
| `--green` | `#34c759` | `rgba(52,199,89,0.08)` | Success, live, available, positive trend |
| `--orange` | `#ff9500` | `rgba(255,149,0,0.08)` | Warning, high priority, pending |
| `--red` | `#ff3b30` | `rgba(255,59,48,0.08)` | Error, destructive, alert badge |
| `--purple` | `#af52de` | `rgba(175,82,222,0.08)` | Creative, AI, secondary category |
| `--teal` | `#5ac8fa` | — | Tertiary accent, avatars |
| `--indigo` | `#5856d6` | `rgba(88,86,214,0.08)` | Technical, settings, system |

### Color Rules

- Never use more than one accent color per card. The card's purpose determines which accent it uses.
- Status pills use the light variant as background + full accent as text: `background: var(--green-light); color: var(--green)`.
- Progress bar gradients go from the accent to a lighter version: `linear-gradient(90deg, var(--blue), #4da6ff)`.
- The only "gradient" allowed in this system is on progress bar fills. Everything else is flat.
- Black is `--text-1` (`#1c1c1e`), never `#000000`.

---

## 3. Typography

### Font Stack

```css
--font-body:  'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'Newsreader', Georgia, serif;
```

DM Sans is the workhorse. Newsreader is used sparingly for editorial moments — the hero bio, testimonial quotes. Never for UI labels.

### Type Scale

| Class | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `.d0` | 52px | 200 | -2.5px | Hero display numbers (single use) |
| `.d1` | 38px | 200 | -1.8px | Large metric values ("07") |
| `.d2` | 26px | 700 | -1.0px | Section metrics, revenue figures |
| `.d3` | 20px | 700 | -0.6px | Card titles, sub-headers |
| `.t1` | 15px | 600 | -0.2px | Card section titles |
| `.t2` | 13px | 600 | -0.08px | List item titles, bold labels |
| `.b1` | 13px | 400 | — | Body text, descriptions |
| `.b2` | 12px | 400 | — | Secondary body, compact text |
| `.cap` | 11px | 500 | — | Captions, metadata |
| `.cap-2` | 10px | 500 | +0.1px | Timestamps, tertiary info |
| `.cap-up` | 10px | 700 | +1.0px | Section labels (uppercase) |

### Typography Rules

- All display numbers (`.d0`, `.d1`, `.d2`, `.d3`) use `font-variant-numeric: tabular-nums` so digits don't cause layout shift.
- Global `letter-spacing: -0.01em` on body. Tighter tracking on larger sizes, looser on small caps.
- Line height: 1.0 for display, 1.15 for `.d3`, 1.4 for body, 1.5–1.65 for longer-form reading.
- The serif font is always italic and weight 300 or 400. Never bold serif. Never non-italic serif in UI context.
- Never underline links. Use `color: var(--blue)` and optional arrow `→` suffix.

### What NOT to do

- Never use Inter, Roboto, Space Grotesk, or system-ui as the primary font.
- Never set body text in a weight heavier than 500.
- Never use ALL CAPS on anything larger than `.cap-up` (10px). Large uppercase text reads as shouting.
- Never center-align body paragraphs. Left-align always. Center only for metrics inside wells.

---

## 4. Spacing & Layout

### Base Unit

The spacing system is based on multiples of 2px, with common values:

| Value | Use |
|---|---|
| 2px | Micro gaps (icon-to-dot, stacked labels) |
| 4px | Tight element groups, tag gaps |
| 6px | Row-tight component gaps |
| 8px | Inner padding deltas, well internal margins |
| 10px | Standard row gaps, card-to-well margin |
| 12px | Grid gap, card padding reduction contexts |
| 14px | Card header/footer vertical padding |
| 16–18px | Primary card padding |
| 24px | Large card padding (hero, CTA, testimonial) |
| 40px | Section vertical spacing |

### Grid System

```css
.g   { display: grid; gap: 12px }
.g2  { grid-template-columns: 1fr 1fr }
.g3  { grid-template-columns: 1fr 1fr 1fr }
.gw  { grid-template-columns: 1.6fr 1fr }    /* Wide + narrow */
.gn  { grid-template-columns: 1fr 1.6fr }    /* Narrow + wide */
```

Max width: `920px`. Page padding: `24px` horizontal, `40px` top.

### Layout Rules

- Cards in a row should share the same height via grid implicit stretch. Use `display: flex; flex-direction: column` inside cards with `margin-top: auto` on footer elements to push them down.
- Wells inside cards always have `border-radius: var(--r-inner)` (12px) — 4px less than the card's 16px. This creates the nested radius relationship.
- No element should touch the card edge. Minimum 14px padding on all sides, except for flush cards (`c-flush`) where list rows handle their own padding.
- Asymmetric grids (`gw`, `gn`) create visual rhythm. Never default to equal columns — vary them.

---

## 5. Border Radii

| Token | Value | Use |
|---|---|---|
| `--r` | 16px | Cards, outer containers |
| `--r-inner` | 12px | Wells, inset containers (always 4px less than parent) |
| `--r-sm` | 10px | Buttons, icon containers |
| `--r-xs` | 8px | Segment controls, tags, small elements |
| 50% | — | Avatars, dots, toggle thumbs |
| 5px | — | Pills, status badges |
| 4px | — | Keyboard shortcut badges, micro-pills |
| 2.5px | — | Progress bars |
| 1.5px | — | Sparkline bars, timeline stripe |

### Radius Rule

Nested containers always reduce radius by 4px per nesting level: card (16) → well (12) → inner element (8). This creates the optical "concentric" rounding that Apple uses.

---

## 6. Shadow System

### Card Shadows

```css
/* Resting */
--shadow:
  0 0 0 0.5px rgba(0,0,0,0.02),       /* Border simulation */
  0 0.5px 1px rgba(0,0,0,0.015),       /* Contact shadow */
  0 2px 8px rgba(0,0,0,0.025);         /* Ambient */

/* Hover */
--shadow-hover:
  0 0 0 0.5px rgba(0,0,0,0.03),
  0 1px 3px rgba(0,0,0,0.025),
  0 8px 28px rgba(0,0,0,0.055);

/* Well (inset) */
--shadow-well: inset 0 0.5px 1px rgba(0,0,0,0.02);
```

### Shadow Rules

- Shadows are three-layered: a 0.5px ring (simulates a border without adding to box model), a tight contact shadow, and a diffused ambient.
- On hover, the ambient layer deepens and spreads. The card lifts 1px via `translateY(-1px)`.
- Wells use a single `inset` shadow — just enough to feel recessed, not enough to look embossed.
- Active/press state collapses back to resting shadow with `scale(0.99)`.
- Tags get their own minimal shadow: `0 1px 3px rgba(0,0,0,0.02)` with a 0.5px border.
- Never use colored shadows. Never use `box-shadow` for glow effects.

### Cursor-Follow Highlight

Every card has a pseudo-element that tracks the mouse position:

```css
.card::before {
  background: radial-gradient(
    380px circle at var(--mx, 50%) var(--my, 50%),
    rgba(0,0,0,0.012),
    transparent 50%
  );
}
```

This creates an extremely subtle spotlight that follows the cursor. It's almost invisible — that's the point. It makes the surface feel responsive without being distracting.

---

## 7. Component Anatomy

### Card Zones

Cards have three optional zones. Not every card uses all three.

```
┌─────────────────────────┐
│  c-header               │  14px vertical padding, 18px horizontal
│  (title + controls)     │
├─────────────────────────┤
│                         │
│  c-body (default)       │  Content area, no extra padding
│                         │
│  ┌───────────────────┐  │
│  │  well             │  │  Inset container, 12px padding
│  │  (nested content) │  │  0.5px border + inset shadow
│  └───────────────────┘  │
│                         │
├─────────────────────────┤
│  c-footer               │  10px top / 12px bottom padding
│  (actions + meta)       │  var(--well) background + top border
└─────────────────────────┘
```

- `c-pad`: Standard card with 18px padding everywhere.
- `c-flush`: Card with zero padding. Used when list rows need edge-to-edge touch targets.
- The footer zone always has `background: var(--well)` and a `0.5px solid var(--sep)` top border. This visually separates actions from content.

### List Row

```
│ [icon-well 32px]  Title (t2)           [reveal on hover]  [chevron] │
│                   Subtitle (cap-2)                                  │
```

- Padding: `11px 18px`.
- Gap between elements: `12px`.
- Hover: `background: var(--fill-2)`. Active: `background: var(--fill-1)`.
- Chevrons are SVG, 7×12px, color `var(--text-5)`.
- The `.reveal` class hides secondary actions (keyboard shortcuts, priority pills) until hover.

### Separator

- Height: `0.5px`. Always. Never 1px.
- Background: `var(--sep)`.
- Indented separators: `margin-left: 54px` (aligns with text after icon well).
- Separators in list-style cards never go edge-to-edge. They start after the leading element (iOS convention).

### Well

Wells are the key depth mechanism. They communicate "this is nested/secondary" without adding visual noise.

- Background: `var(--well)` — barely distinguishable from `var(--card)`.
- Border: `0.5px solid var(--sep)`.
- Shadow: `inset 0 0.5px 1px rgba(0,0,0,0.02)`.
- Radius: `var(--r-inner)` (12px).
- Padding: 12px default, 8–10px for compact wells (e.g. availability indicator, add-action).

### Avatar

| Size | Class | Dimensions | Font | Use |
|---|---|---|---|---|
| Large | `.av-lg` | 48×48 | 17px/600 | Hero profile |
| Default | `.av` | 36×36 | 13px/600 | List items, cards |
| Small | `.av-sm` | 26×26 | 9px/700 | Stacks, compact rows |
| XS | `.av-xs` | 20×20 | 8px/700 | Dense stacks |

- Always solid background color with white initials. No images, no gradients on the avatar itself.
- Online indicator: 10×10px green circle, positioned `bottom:0; right:0`, with a 2px `var(--card)` border.
- Avatar stacks overlap by 5px with `margin-left: -5px` and a 2px card-colored border.

### Progress Bar

- Track: `var(--fill-1)`, height 4px (default) or 6px (`.prog-lg`), radius 2.5px / 3px.
- Fill: `linear-gradient(90deg, var(--prog-a), var(--prog-b))`. Always a subtle gradient, never flat.
- Animation: `width` transitions over 0.9s with `ease-out`.
- Always show the percentage value as text nearby — progress bars alone are ambiguous.

### Segment Control

Exact iOS replication:

- Container: `var(--fill-1)` background, `var(--r-xs)` radius, 2px padding.
- Items: transparent background, `var(--text-3)` color, 11px/600 font.
- Active item: `var(--card)` background, `var(--text-1)` color, with shadow `0 0.5px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.03)`.
- The active pill should feel like it physically floats above the track.

### Toggle

- Track: 42×25px, 13px radius.
- On: `var(--green)`. Off: `rgba(120,120,128,0.16)`.
- Thumb: 21×21px circle, white, positioned 2px from edges.
- Shadow on thumb: `0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04)`.
- Transition: `left 0.25s cubic-bezier(.4, 1.2, .6, 1)` — the spring overshoot is essential.

### Tag

Tags represent technologies, categories, or skills.

- Background: `var(--card)` with `0.5px solid var(--sep)` border.
- Shadow: `0 1px 3px rgba(0,0,0,0.02)`.
- Padding: `6px 10px`, radius `var(--r-xs)`.
- Contains: colored dot (7px circle) + label (12px/500).
- Hover: lifts 1px with card-level shadow. This makes the tag feel individually interactive.

### Pill

Compact status indicators.

- Default: `var(--fill-1)` background, `var(--text-3)` text, 10px/600.
- Colored: uses accent light variant as bg, full accent as text. Padding `2px 7px`, radius 4px.

### Button

| Variant | Background | Text | Use |
|---|---|---|---|
| Primary `.btn-p` | `var(--blue)` | white | Main actions (Join Call, Contact) |
| Secondary `.btn-s` | `var(--fill-1)` | `var(--blue)` | Secondary (New Task, filters) |
| Ghost `.btn-ghost` | transparent | `var(--blue)` | Tertiary (View case study →) |

- Padding: `8px 16px`, radius `var(--r-sm)`.
- Active state: `scale(0.96); opacity: 0.85` — fast 0.15s transition.
- Primary hover: `filter: brightness(1.08)` — avoids hardcoding a darker blue.
- Never use outlines/bordered buttons. The fill-1 secondary style is the "light" option.

---

## 8. Motion

### Easing Functions

```css
--spring:   cubic-bezier(.4, 1.6, .6, 1);   /* Overshoot — toggles, checkboxes */
--ease-out: cubic-bezier(.25, 1, .5, 1);     /* Smooth decel — entrances, progress */
```

### Entrance Animation

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(10px) scale(0.995); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

- Duration: 0.45s.
- Stagger: +40ms per grid child.
- Triggered by IntersectionObserver (animate on scroll into view, not on page load).
- The `scale(0.995)` is almost imperceptible but adds physicality.

### Interaction Timings

| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Card hover lift | 0.35s | ease-out | transform, box-shadow |
| Card press | 0.1s | linear | transform, box-shadow |
| List row highlight | 0.12s | linear | background |
| Toggle slide | 0.25s | spring | left |
| Checkbox toggle | 0.2s | spring | scale, background |
| Progress fill | 0.9s | ease-out | width |
| Ring fill | 1.2s | ease-out | stroke-dashoffset |
| Tag hover | 0.2s | ease | transform, box-shadow |
| Cursor glow appear | 0.4s | linear | opacity |
| Image zoom on card hover | 0.5s | ease-out | transform (scale 1.03) |

### Motion Rules

- Never animate color directly. Use opacity or filter instead.
- The spring easing (`--spring`) is reserved for elements that "land" somewhere: toggle thumbs, checkboxes, items snapping into place.
- Everything else uses `--ease-out` for smooth deceleration.
- Card hover lift is exactly 1px. Not 2px. Not 3px. One pixel.
- Press states are fast (100ms) and feel like physical compression: `scale(0.99)` with shadow collapsing.
- Never use `transition: all`. Always specify exact properties.

---

## 9. Iconography

### Rules

- All icons are inline SVG. Never use emoji as icons. Never use icon fonts.
- Stroke-based, not filled. Stroke width: 1.0–1.4px depending on icon size.
- Color inherits from context: `var(--text-3)` for neutral, accent color when inside a tinted icon well.
- Icon wells: 32×32px default, 40×40px for service cards. Radius 8px (default) or 10px (large).
- Icon well backgrounds always use the accent's light variant: `var(--blue-light)`, `var(--green-light)`, etc.
- Chevrons: 7×12px, stroke 1.3px, `round` linecap/linejoin. Color: `var(--text-5)`.

### SVG Template

```html
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="..." stroke="var(--blue)" stroke-width="1.2"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
```

---

## 10. Anti-Patterns — The Blacklist

These are explicitly banned. If you see them in a design, it's wrong.

### Typography
- ❌ Inter, Roboto, Space Grotesk, Poppins, or any "default AI font"
- ❌ System-ui as the visible font (fine in fallback stack only)
- ❌ Bold serif text in UI context
- ❌ Centered body paragraphs
- ❌ Uppercase text larger than 10px
- ❌ Underlined links

### Color & Surface
- ❌ Pure black (`#000000`) — use `--text-1`
- ❌ Colored shadows or glow effects
- ❌ Gradient backgrounds on cards or page
- ❌ Purple-on-white gradient (the universal AI slop signature)
- ❌ More than one accent color per card
- ❌ Decorative blobs, mesh gradients, or abstract shapes
- ❌ Background patterns or textures (the bg is flat `--bg`, always)

### Layout
- ❌ Equal-width grid columns by default (vary with `gw`/`gn`)
- ❌ Edge-to-edge separators in list-style cards (indent them)
- ❌ Cards with no internal hierarchy (every card needs wells or zones)
- ❌ Identical card heights forced by excessive padding

### Motion
- ❌ `transition: all`
- ❌ Bounce easing on cards (spring is for small elements only)
- ❌ Hover lifts greater than 2px
- ❌ Entrance animations on page load for below-fold content (use scroll trigger)
- ❌ Decorative loading spinners or skeleton screens in a portfolio context

### Components
- ❌ Emoji as icons (use SVG always)
- ❌ Icon fonts (Font Awesome, Material Icons)
- ❌ Outlined/bordered buttons (use fill-1 secondary instead)
- ❌ Placeholder illustrations, stock graphics, abstract hero images
- ❌ "Get in touch" without showing actual contact info and rate
- ❌ Generic "services" cards without concrete tech listed in wells
- ❌ Testimonials without name, title, and company
- ❌ Star ratings without the numerical value nearby

---

## 11. Implementation Reference

### CSS Custom Properties (Full Set)

```css
:root {
  /* Surface */
  --bg:         #f2f2f7;
  --card:       #ffffff;
  --well:       #f9f9fb;
  --well-2:     #f4f4f8;

  /* Text */
  --text-1:     #1c1c1e;
  --text-2:     #3a3a3c;
  --text-3:     #8e8e93;
  --text-4:     #c7c7cc;
  --text-5:     #d5d5da;

  /* Borders & fills */
  --sep:        rgba(60, 60, 67, 0.06);
  --fill-1:     rgba(120, 120, 128, 0.08);
  --fill-2:     rgba(120, 120, 128, 0.05);
  --fill-3:     rgba(120, 120, 128, 0.03);

  /* Accents */
  --blue:       #007aff;
  --blue-light: rgba(0, 122, 255, 0.08);
  --green:      #34c759;
  --green-light:rgba(52, 199, 89, 0.08);
  --orange:     #ff9500;
  --orange-lt:  rgba(255, 149, 0, 0.08);
  --red:        #ff3b30;
  --red-light:  rgba(255, 59, 48, 0.08);
  --purple:     #af52de;
  --purple-lt:  rgba(175, 82, 222, 0.08);
  --teal:       #5ac8fa;
  --indigo:     #5856d6;
  --indigo-lt:  rgba(88, 86, 214, 0.08);

  /* Radii */
  --r:          16px;
  --r-inner:    12px;
  --r-sm:       10px;
  --r-xs:       8px;

  /* Shadows */
  --shadow:       0 0 0 0.5px rgba(0,0,0,0.02), 0 0.5px 1px rgba(0,0,0,0.015), 0 2px 8px rgba(0,0,0,0.025);
  --shadow-hover: 0 0 0 0.5px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.025), 0 8px 28px rgba(0,0,0,0.055);
  --shadow-well:  inset 0 0.5px 1px rgba(0,0,0,0.02);

  /* Motion */
  --spring:     cubic-bezier(.4, 1.6, .6, 1);
  --ease-out:   cubic-bezier(.25, 1, .5, 1);

  /* Typography */
  --font-body:  'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Newsreader', Georgia, serif;
}
```

### Dark Mode Override (Reference)

If adapting to the halftone portfolio theme, swap these tokens:

```css
:root[data-theme="dark"] {
  --bg:       #121214;
  --card:     #1c1c1e;
  --well:     #2c2c2e;
  --well-2:   #242426;
  --text-1:   #f5f5f7;
  --text-2:   #c7c7cc;
  --text-3:   #8e8e93;
  --text-4:   #48484a;
  --text-5:   #3a3a3c;
  --sep:      rgba(255, 255, 255, 0.06);
  --fill-1:   rgba(255, 255, 255, 0.08);
  --fill-2:   rgba(255, 255, 255, 0.05);
  --fill-3:   rgba(255, 255, 255, 0.03);
  --shadow:       0 0 0 0.5px rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.3);
  --shadow-hover: 0 0 0 0.5px rgba(255,255,255,0.05), 0 8px 28px rgba(0,0,0,0.5);
  --shadow-well:  inset 0 0.5px 1px rgba(0,0,0,0.15);
}
```

---

## 12. Component Inventory

| Component | Zones Used | Key Features |
|---|---|---|
| **Hero** | pad | Avatar w/ online dot, serif bio, 3-metric wells, availability pill |
| **Project Card** | flush + footer | Image zone w/ number, status pills, tech tags, KPI well, case study link |
| **Services** | pad | Icon well (40px), description, capability-tag well |
| **Tech Stack** | pad | Grouped sections (cap-up labels), tags w/ dots + experience years |
| **Experience** | flush | Timeline dots + lines, role/company/date, description wells, status pills |
| **Testimonial** | pad | Serif quote mark, serif italic body, separator, reviewer row + stars |
| **Blog Card** | flush (horizontal) | Date strip (day+month), tag+read time, topic pills, read link |
| **Contact CTA** | pad | Availability dot, 3 hoverable contact wells, rate card well w/ kbd |

---

*Last updated: April 2026*
*System version: Elevation v1*
