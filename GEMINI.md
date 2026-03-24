# hluaguo.com

## Project Overview

**hluaguo.com** is a personal website, digital outpost, portfolio, and journal. It is built as a server-side rendered (SSR) web application utilizing a modern, edge-first technology stack. The project features a custom-built content management system (CMS) directly integrated into the application, designed with a minimal, organic, and earth-toned aesthetic.

### Core Technologies

*   **Framework:** Astro (v6) configured for Server-Side Rendering (`output: 'server'`).
*   **UI Library:** React (v19) via `@astrojs/react` integration.
*   **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` and `@tailwindcss/typography`).
*   **Maps:** `react-leaflet` and `leaflet` for the Atlas/places feature.
*   **Database (Metadata):** Cloudflare D1 (SQL database).
*   **Storage (Content & Media):** Cloudflare R2 (Object storage).
*   **Hosting/Deployment:** Cloudflare Pages (via `@astrojs/cloudflare` adapter).
*   **Package Manager:** `pnpm`.

## Architecture & Data Flow

*   **Custom CMS:** The site includes a protected admin portal at `/admin`.
*   **Data Separation:**
    *   **Cloudflare D1 (`OUTPOST_DB`):** Stores structured metadata in three main tables: `posts` (journal entries), `portfolio` (projects), and `places` (map locations). See `schema.sql`.
    *   **Cloudflare R2 (`OUTPOST_STORAGE`):** Stores the actual Markdown content for posts and portfolio items, as well as uploaded images and media.
*   **API Routes:** Backend logic is handled via Astro API routes (e.g., `src/pages/api/posts.ts`). These routes securely interact with D1 and R2 using Cloudflare environment bindings and require an `ADMIN_KEY` for mutating operations.

## Directory Structure

*   `src/`: Main source code directory.
    *   `src/pages/`: Astro file-based routing. Contains public pages, the `/admin` portal, dynamic routes for blog/portfolio (`[slug].astro`), and `/api` endpoints.
    *   `src/components/`: Reusable UI components (both `.astro` and `.tsx` React components).
    *   `src/layouts/`: Base layout templates (e.g., `Layout.astro` which includes global UI wrappers like noise overlays and glow backgrounds).
    *   `src/styles/`: Global stylesheets (`global.css`).
*   `schema.sql`, `places_schema.sql`, `seed_places.sql`: SQLite files for configuring and seeding the Cloudflare D1 database.
*   `astro.config.mjs`: Framework configuration, defining Vite plugins, integrations, and Cloudflare adapter settings.
*   `wrangler.jsonc`: Cloudflare configuration file defining compatibility dates, asset directories, and bindings for D1 and R2.
*   `.gemini/`: Contains Gemini CLI skills (e.g., `ui-ux-pro-max`), providing AI-assisted design and styling capabilities.

## Building and Running

Ensure you have `pnpm` installed.

### Local Development

```bash
# Install dependencies
pnpm install

# Start the development server (runs on localhost:4321)
pnpm run dev

# Generate Cloudflare TypeScript environment types based on wrangler.jsonc
pnpm run generate-types
```

### Production

```bash
# Build the application for Cloudflare Pages
pnpm run build
```

## Development Conventions

*   **Component Usage:** Astro components (`.astro`) are preferred for layout and static UI. React components (`.tsx`) are used where client-side interactivity is required (e.g., the interactive Map).
*   **Styling:** Utility-first styling with Tailwind CSS v4. The project relies on custom theme values (like `earth` tones) likely defined in the CSS or Tailwind config.
*   **Map Integration:** When working with `react-leaflet`, note the specific exclusions in `astro.config.mjs` (`vite.optimizeDeps.exclude` and `ssr.noExternal`) necessary to prevent SSR issues with Leaflet's DOM dependencies.
*   **Security:** API routes performing mutations (POST, DELETE) are protected by checking an `ADMIN_KEY` against the provided key in the request payload. Do not expose this key.
*   **Database Schema:** Any modifications to the data structure require updating `schema.sql` and applying those changes to the Cloudflare D1 instance.