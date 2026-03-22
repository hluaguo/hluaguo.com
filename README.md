# hluaguo.com

Hugo Lau's digital outpost. An aesthetic, minimal personal portfolio and journal built with earth tones and organic editorial design.

## Tech Stack

- **Framework:** [Astro](https://astro.build)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + Typography
- **Maps:** [React-Leaflet](https://react-leaflet.js.org/)
- **Deployment:** Cloudflare Pages
- **Package Manager:** `pnpm`

## Local Development

```bash
# Install dependencies
pnpm install

# Start the development server at localhost:4321
pnpm run dev

# Build for production
pnpm run build
```

## Content Management

- **Admin Portal:** Manage your journal and portfolio at `/admin` (requires Cloudflare environment).
- **Storage:** Metadata in **Cloudflare D1**, content in **Cloudflare R2**.
- **Atlas (Map):** Update the `places` array inside `src/components/Map.tsx`.

## Deployment

Deploy to Cloudflare Pages. Ensure the `OUTPOST_DB` and `OUTPOST_ASSETS` bindings are configured in the Cloudflare Dashboard under **Pages > Settings > Functions > Compatibility flags / Bindings**.
