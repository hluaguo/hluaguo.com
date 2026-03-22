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

- **Journal:** Add markdown files to `src/content/blog/`
- **Portfolio:** Add markdown files to `src/content/portfolio/`
- **Atlas (Map):** Update the `places` array inside `src/components/Map.tsx`
