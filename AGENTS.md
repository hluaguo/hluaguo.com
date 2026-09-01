# AGENTS.md

Instructions for AI coding agents (and humans) working on this repository.

## What this site is

**hluaguo.com** — a single-page personal showcase for Hugo Lau. One scroll-
driven story: five full-viewport panels (Intro → What I do → Selected work →
Now → Contact). There is intentionally **no blog, no CMS, no map, no admin,
no database**. The old React/CMS/Atlas architecture was removed; it only
exists in git history.

## Tech stack

- **Astro 6**, `output: 'server'` + `@astrojs/cloudflare` (deployed on Cloudflare)
- **Tailwind CSS v4** via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`)
- **Vanilla GSAP** (`gsap` + `gsap/ScrollTrigger`) in a plain Astro `<script>` tag
- **No React. No UI framework. No client-side islands.** Do not reintroduce them.

## Commands

```bash
pnpm install        # pnpm only (see package.json engines + pnpm config)
pnpm dev            # dev server on :4321
pnpm build          # production build (must pass before you finish)
```

## Project structure

```
src/
  layouts/Layout.astro        # shell: fonts, grain overlay, body defaults
  pages/index.astro           # THE site — all five story panels
  components/ui/
    FlowArt.astro             # scroll engine (GSAP pins + sweep rotation)
    FlowSection.astro         # one full-bleed panel
    LogoMark.astro            # the stencil-H logo mark (currentColor SVG)
  styles/global.css           # @theme tokens, base, marquee keyframes
DESIGN_LANGUAGE.md            # ⬅ the design source of truth
astro.config.mjs              # Astro + Tailwind vite plugin + Cloudflare adapter
wrangler.jsonc                # Cloudflare deploy config (no DB bindings anymore)
```

## Design language — REQUIRED READING

**All UI work is bound by [`DESIGN_LANGUAGE.md`](./DESIGN_LANGUAGE.md).**
Before adding or changing any component, panel, color, or animation, read it
and follow it. Summary: Swiss poster typography + brutalist color blocking +
scroll-driven storytelling. Flat colors, one font (Plus Jakarta Sans),
`clamp()`/`vw` display type, hairline rules, no shadows/gradients/radius.

If you intentionally deviate, update `DESIGN_LANGUAGE.md` in the same change.

## Conventions

1. **Plain `.astro` components only.** Client-side interactivity goes in a
   normal `<script>` tag inside the component (Astro bundles it); prefer a
   tiny vanilla-JS pattern like FlowArt's. Importing client frameworks
   (React/Vue/Svelte) is forbidden.
2. **One page.** New content = new `FlowSection` panel in
   `src/pages/index.astro`, following the canonical panel anatomy in
   `DESIGN_LANGUAGE.md` §5. Number the eyebrows sequentially.
3. **Styling is Tailwind utilities + tokens from `global.css`.** Don't add a
   Tailwind config file; extend `@theme` in CSS if a token is needed.
4. **Motion:** GSAP for scroll choreography (in FlowArt's script), CSS
   keyframes for ambient loops (marquee). Everything must respect
   `prefers-reduced-motion`.
5. **Links out** (GitHub, email) use hard-bordered uppercase micro-CTA bars —
   see the Contact panel for the pattern.
6. **Package manager is pnpm.** Note `pnpm.onlyBuiltDependencies` in
   `package.json` (pnpm 11+ requires approving build scripts).
7. **TypeScript** strict mode (extends `astro/tsconfigs/strict`); JSX settings
   remain but are unused since React was removed.

## Deployment

Cloudflare (wrangler). `pnpm build` produces the server bundle; `wrangler.jsonc`
holds the config. There are no D1/R2 bindings — if a feature seems to need a
database, reconsider: this is a static-content showcase.

## Definition of done

- `pnpm build` passes with no errors
- Page renders all panels; scroll choreography works; `prefers-reduced-motion`
  degrades gracefully
- Any visual change is consistent with `DESIGN_LANGUAGE.md` (or the doc was
  updated to match)
