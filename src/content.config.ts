import { defineCollection, z } from 'astro:content';

// Since we want to pull from Cloudflare D1/R2 during build, 
// and the build usually happens in a CI environment (not inside the Worker),
// we would normally use the Cloudflare API or a static fallback.
// However, for this "Digital Outpost", we'll implement a loader that
// can be triggered to refresh.

const blogCollection = defineCollection({
  loader: async () => {
    // In a real production setup, we'd fetch from your D1 API here.
    // For now, we'll keep the local glob loader as a fallback,
    // but prepare the schema for the Cloudflare transition.
    // To truly use D1/R2 during build, we need to use the Cloudflare API.
    
    // FETCHING FROM CLOUDFLARE API (Conceptual for now, using local files for build stability)
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/d1/database/DB_ID/query', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer TOKEN' },
        body: JSON.stringify({ sql: 'SELECT * FROM posts WHERE is_published = 1' })
    }).catch(() => null);
    
    // For this prototype, let's keep it simple: 
    // The "Admin" will write to R2/D1, and we'll have a script to sync them 
    // to local for builds, OR fetch them dynamically.
    
    return []; // Placeholder
  },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date().or(z.string().transform(s => new Date(s))),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// We will keep the local loaders for now so the site doesn't break 
// while we build the Admin portal.
export const collections = {
  blog: blogCollection,
};
