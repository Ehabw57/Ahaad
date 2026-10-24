---
name: Ahaad Minimalist Utility
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#43474e'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#341f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#503300'
  on-tertiary-container: '#c69b5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#edbf7f'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#60410c'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 3rem
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.5rem
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.875rem
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.5rem
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.375rem
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 1rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a quiet, dependable, utility-first foundation for an Arabic-first online tools directory. The atmosphere evokes clarity, precision, and intellectual calm—reminiscent of architectural indexing systems and high-grade editorial archives. It strips away ornamental noise in favor of uncompromised legibility, rapid mental scanning, and utilitarian dignity.

The design movement blends **Minimalism** with structural **Low-Contrast Modernism**:
- **Utilitarian & Unobtrusive:** The interface acts as neutral architectural scaffolding. The directory tools are the primary content; the container never competes with them.
- **RTL-Native Rhythm:** Engineered from the ground up for right-to-left layout dynamics, respecting natural Arabic reading flow, optical balance, and proportional baseline rhythm.
- **Precision Craft:** Crisp 1px hairline boundaries, absence of diffuse elevation shadows, and strictly regulated whitespace produce a lightweight, dependable toolset feel.

## Colors

The palette is rigorously restrained and monochromatic, punctuated solely by a muted slate-petrol accent (`#1E3A5F`) for active states, key affordances, and selected anchors.

### Light Mode (Default)
- **Background (`canvas`):** `#FFFFFF` — Pure white for crisp contrast.
- **Surface (`container`):** `#F8F9FA` — Subtle neutral tint for search bars, card modules, and contextual panels.
- **Hairline Borders:** `#E5E7EB` — Deliberate 1px boundary lines that define spaces without visual mass.
- **Text Primary:** `#111827` — High-contrast deep slate-black for effortless Arabic typography legibility.
- **Text Secondary / Muted:** `#6B7280` — Mid-tone neutral for metadata, shortcuts, tool categories, and timestamps.
- **Accent Primary:** `#1E3A5F` — Sophisticated deep slate-petrol for active tab indicators, selected category chips, and focused inputs.

### Dark Mode
- **Background (`canvas`):** `#0F172A` — Deep obsidian slate.
- **Surface (`container`):** `#1E293B` — Elevated utility surface.
- **Hairline Borders:** `#334155` — Subdued slate structural strokes.
- **Text Primary:** `#F8FAFC` — Crisp cool-white.
- **Text Secondary:** `#94A3B8` — Balanced muted slate.
- **Accent Primary:** `#38BDF8` — Tuned luminous slate-cyan tone used strictly for pinpoint interactive highlights.

### Usage Guidance
- Never apply decorative gradients or vibrant primary fills.
- Interactive states rely on subtle tonal shifts (e.g., hover from `#FFFFFF` to `#F8F9FA` or border hover from `#E5E7EB` to `#94A3B8`) rather than saturated color floods.

## Typography

The typography leverages **IBM Plex Sans** (with full native support for **IBM Plex Sans Arabic**). The Arabic script requires deliberate vertical line compensation: line heights are expanded slightly beyond Latin defaults to prevent diacritic and loop clipping while keeping multi-line tool descriptions airy and legible.

### RTL Baseline & Optical Hierarchy
- **Line Heights:** Body and headline line heights are intentionally generous (`1.6x` to `1.8x`) to ensure tall Arabic ascenders and descenders breathe naturally.
- **Letter Spacing:** Keep tracking neutral (`0`) for Arabic scripts; never apply positive letter-spacing to connected Arabic letterforms.
- **Numerals:** Support both Western and Eastern Arabic numerals in uniform tabular figures within data grids, shortcut indicators, and index counts.

## Layout & Spacing

The layout is built around a disciplined fluid grid capped at a maximum container width of `1200px` for optimal eye-tracking during desktop browsing.

### Grid & Breakpoints
- **Mobile (<640px):** Single-column stack with `margin: 1rem` and `gutter: 1rem`. Search inputs take full width; category filters scroll horizontally in a frictionless swipe rail.
- **Tablet (640px - 1024px):** 6-column grid with `1.25rem` gutters. Tool cards organize into 2-column modules.
- **Desktop (>1024px):** 12-column grid with `1.5rem` gutters and `2rem` outer page margins. Directory views cleanly subdivide into 3-column or 4-column balanced card grids.

### RTL Layout Conventions
- Structural gutters and margins invert automatically: content begins at the top-right and flows leftward.
- Internal component paddings prioritize logical CSS properties (`padding-inline-start`, `margin-inline-end`) ensuring robust cross-browser RTL alignment.

## Elevation & Depth

This design system deliberately rejects heavy skeuomorphism and blurry drop-shadows. Depth is articulated purely through **flat structural containment** and **low-contrast outline discipline**:

- **Zero Card Drop-Shadows:** Standard cards and containers use `box-shadow: none`. Hierarchy is conveyed via a precise `1px solid #E5E7EB` (dark mode: `#334155`) boundary line against `#FFFFFF` or `#F8F9FA` fills.
- **Tonal Layering:** The base background is white (`#FFFFFF`), while subtle grouping areas (such as search boxes, filter containers, and tool metadata tags) sit on `#F8F9FA`.
- **Floating Modals & Flyouts:** In the rare event of dropdown menus or search command palettes, depth is achieved with a crisp 1px border paired with an imperceptible, low-spread ambient shadow (`0 4px 12px -2px rgba(0, 0, 0, 0.04)`).

## Shapes

Shapes reflect restrained modernity. Radii are kept moderate and disciplined (`roundedness: 2` — `0.5rem` / `8px` default base, up to `0.75rem` / `12px` for primary tool cards):

- **Tool Cards & Content Modules:** `rounded-lg` (`0.5rem` to `0.75rem` max).
- **Search Inputs & Form Elements:** `rounded-md` (`0.375rem` to `0.5rem`).
- **Category Filter Pills:** Semi-rounded capsules (`rounded-full`) for tactile tagging and visual differentiation from rectangular content cards.
- **Subtle Icon Badges:** `rounded-md` (`0.375rem`).

## Components

### Buttons & Interactive Controls
- **Primary Action:** Solid `#1E3A5F` background, white label, 1px border matching background, `rounded-md`, 0.5rem vertical by 1rem horizontal padding.
- **Secondary Action:** Transparent background with 1px border in `#E5E7EB`, text in `#111827`. Hover shifts background to `#F8F9FA`.
- **Ghost / Utility:** Borderless with muted `#6B7280` text, transitioning to `#111827` on hover.

### Category Pills & Filter Chips
- Rendered as compact, horizontal pill elements with `rounded-full` curvature.
- Inactive state: `#F8F9FA` fill, `1px solid #E5E7EB`, `#475569` text.
- Active state: `#1E3A5F` text and border with a subtle tinted background (or reversed solid slate background for high-focus view).
- Arranged horizontally with intuitive RTL alignment; scroll arrows or fading edge gradients appear when filters overflow viewport bounds.

### Tool Directory Cards
- **Structure:** Flat container with a 1px solid border (`#E5E7EB`), `rounded-lg` corner radius, and zero drop shadow.
- **Internal Rhythm:** Top section showcases the tool icon (neatly bounded in a 40x40px subtle square), tool title in `headline-sm`, and an external link badge. The middle section holds a two-line description in `body-sm` (`#475569`). The footer houses categorical tags and pricing indicators.
- **Interaction:** Hover triggers a crisp 1px border tint change to `#94A3B8` without translateY jumps or dramatic scaling.

### Search Field & Discovery Bar
- Prominent yet understated, centered in the header or hero region.
- Background in `#F8F9FA` with a hairline `#E5E7EB` border.
- Integrated right-aligned search line-icon (in RTL view) and left-aligned keyboard shortcut chip (`⌘K` / `Ctrl+K`).
- Focus state reveals a precise 1px focus ring in `#1E3A5F` without outer glow.

### Lists & Key-Value Specs
- Dividers between tool features or metadata use subtle 1px hairline rules (`#F1F5F9`).
- Labels sit right-aligned in secondary text, and values sit left-aligned in crisp primary typography.

### Checkboxes & Radio Elements
- Square (`rounded-sm`) for checkboxes and circle (`rounded-full`) for radios with 1px border.
- Checked state uses `#1E3A5F` fill with a sharp white checkmark glyph.