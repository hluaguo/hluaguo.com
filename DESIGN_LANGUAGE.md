# DESIGN_LANGUAGE.md — hluaguo.com

This document is the **single source of truth** for the visual design of this
site. Any UI change must conform to it. If a change deliberately departs from
it, update this file in the same commit.

> **In one line:** Swiss poster typography + brutalist color blocking,
> delivered as scroll-driven cinematic storytelling.

---

## 1. Philosophy

1. **Content is the interface.** Type, color and rhythm carry the design —
   no cards, no shadows, no gradients, no rounded corners, no decoration.
2. **Scroll is the navigation.** Panels are pinned and swept over each other;
   scrolling *is* the page-transition.
3. **Poster scale.** Headlines are set at viewport scale
   (`clamp(3.5rem, 12vw, 14rem)`) and behave like printed posters.
4. **Flat and honest.** Solid color blocks only. Depth comes from motion and
   stacking, never from drop shadows or blurs.
5. **Motion is meaning.** Every animation either reveals content, directs the
   eye, or invites an action. Nothing spins for decoration.

---

## 2. Typography

| Token         | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Family        | `Plus Jakarta Sans` (Google Fonts, variable 200–800) — the **only** font |
| Display       | `font-extrabold uppercase tracking-tight leading-[0.85]`, size `text-[clamp(3.5rem,12vw,14rem)]`, broken into 2–4 stacked words |
| Eyebrow label | `text-xs font-bold uppercase tracking-[0.2em]` — always "NN — Label" |
| Column title  | `text-sm font-bold uppercase tracking-wider`                 |
| Body large    | `text-[clamp(1rem,2.5vw,2rem)] leading-relaxed`, `max-w-[50ch]` |
| Body small    | `text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75` |
| Micro CTA     | `text-[10px–xs] font-bold uppercase tracking-[0.25em]`       |

Rules:

- Headlines break manually with `<br />` into short stacked words
  ("Code / As / Craft"). Never let them wrap naturally.
- Hierarchy is achieved with **weight, size and opacity** (75% for supporting
  text) — never with color changes inside a panel.
- Hairline rules (`<hr class="my-[2vw] border-0 border-t border-black/60">`
  or `border-white/60`) separate rows inside a panel. They use `currentColor`
  at reduced opacity.

## 3. Color

Flat, saturated, editorial. Exactly these panel backgrounds:

| Panel           | Hex       | Text  | Rules               |
| --------------- | --------- | ----- | ------------------- |
| Intro (orange)  | `#FD5200` | white | black hairlines     |
| Statement (black) | `#000000` | white | `white/60` hairlines |
| Work (cream)    | `#F5F0E8` | black | `black/60` hairlines |
| Now (blue)      | `#1A3DE8` | white | `white/50` hairlines |
| Contact (black) | `#000000` | white | `white/60` hairlines |

- Accent-on-interaction: `#1A3DE8` (the blue) may be used as a hover state on
  the cream panel (see the marquee).
- Body background is `#000` (only visible during overscroll).
- Selection: `selection:bg-white selection:text-black`.
- **Never** introduce gradients, translucent glass, or new hues. One new
  panel color max, and it must be added to this table.

## 4. Layout & spacing

- Every panel is a **full-viewport** section: `min-h-screen w-full`.
- Panel padding: `px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]` — spacing is
  expressed in `vw` (with `clamp` where it must stop growing).
- Inner structure: `flex flex-col justify-between gap-6` so label / headline /
  body / CTA distribute across the full height.
- Column rows: `flex flex-wrap gap-[3vw]` with `min-w-[180px] flex-1` cells.
- Full-bleed elements (e.g. the marquee) break out with negative margins
  (`-mx-[4vw]`) and are clipped by the panel's `overflow-hidden`.
- No max-width containers, no centered layouts — panels are full-bleed and
  left-anchored.

## 5. Core components

| File                                    | Role                                                |
| --------------------------------------- | --------------------------------------------------- |
| `src/components/ui/FlowArt.astro`       | Scroll engine. Wraps all panels; owns the GSAP script |
| `src/components/ui/FlowSection.astro`   | One full-bleed pinned panel (`data-flow-section`)   |
| `src/layouts/Layout.astro`              | Document shell: fonts, grain overlay, body defaults |
| `src/styles/global.css`                 | Theme tokens (`@theme`), base styles, `@keyframes marquee` |

### Panel anatomy (canonical order)

```
<FlowSection style={{ 'background-color': '#FD5200', color: '#fff' }}>
  1. eyebrow label      "01 — Hello, I'm Hugo"
  2. hairline
  3. giant stacked headline (h1 for first panel, h2 after)
  4. hairline
  5. one of: large intro paragraph · 3-column row · stats row
  6. hairline (when more content follows)
  7. closing line (often mt-auto / ml-auto text-right) or CTA
</FlowSection>
```

## 6. Motion

**Engine:** vanilla `gsap` + `gsap/ScrollTrigger` in a `<script>` tag inside
`FlowArt.astro` (Astro bundles it — no client framework).

- **Panel sweep:** every panel except the first is pinned
  (`start: 'bottom bottom'`, `pinSpacing: false`) and its inner container
  un-rotates `30deg → 0deg` (origin bottom-left) as it enters
  (`start: 'top bottom'`, `end: 'top 25%'`, `scrub: true`).
- **Marquee:** infinite linear loop (`--animate-marquee`, 22s, `translateX(-50%)`,
  content duplicated once for seamlessness). Hover pauses it and recolors it.
- **Hover grammar:** color inversion (white fill on black outline CTA),
  opacity `75 → 100` on text, arrows translate. `transition-colors duration-500`.
- **Accessibility:** all scripted motion must be skipped under
  `prefers-reduced-motion` (FlowArt checks `matchMedia`); the global CSS also
  collapses animation durations. Respect this in any new animation.

## 7. Texture

A single fixed SVG grain/noise overlay (`mix-blend-multiply`,
`opacity ~0.08`, `pointer-events-none`, `z-50`) lives in `Layout.astro` and
sits above everything. Do not add glassmorphism, blur, or glow layers.

## 8. Logo

The mark is a **stencil H** — the letter sliced by two full-width hairline
cuts, freezing the site's hairline-rule motif into the letterform. Five flat
rectangles on a 100×100 grid (see `src/components/ui/LogoMark.astro` for
exact geometry):

| Piece            | y-range |
| ---------------- | ------- |
| stem tops (×2)   | 8–35    |
| crossbar band    | 40–60 (full 72-unit width) |
| stem bottoms (×2)| 65–92   |
| hairline gaps    | 5 units, at y 35–40 and 60–65 |

- Default color: `#FD5200` on `#000000` (favicon, dark panels).
- The component uses `currentColor` — on the orange intro panel it renders
  in black.
- Files: `src/components/ui/LogoMark.astro` (in-site),
  `public/favicon.svg` (black tile + orange mark), `public/logo-mark.svg`
  (bare mark for external use).
- Never round the corners, outline it, or add gradients/shadows. Don't
  redraw it in a font — it is five rectangles, nothing else.

## 9. Do / Don't

**Do**

- Add new content as new `FlowSection` panels with new flat colors (update §3)
- Use `clamp()` + `vw` for all display sizing
- Keep eyebrows numbered ("05 — …") so panels read as chapters
- Link CTA bars full-width with hard 2px borders when they end a chapter

**Don't**

- No React, no client framework, no hydration islands
- No images as decoration (this site is typographic; photos only if they are
  *content*, and then full-bleed)
- No border-radius, box-shadows, gradients, or glass effects
- No new fonts — one family, many weights
- No animation that ignores `prefers-reduced-motion`
