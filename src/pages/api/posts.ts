import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const db = (env as any).OUTPOST_DB;
  const bucket = (env as any).OUTPOST_ASSETS;

  try {
    const data = await request.formData();
    const type = data.get('type') as string; // 'post' or 'portfolio'
    const title = data.get('title') as string;
    const slug = data.get('slug') as string;
    const description = data.get('description') as string;
    const content = data.get('content') as string;
    const extra = data.get('extra') as string; // year for portfolio

    if (!title || !slug || !content || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // 1. Upload content to R2
    const contentPath = `${type}s/${slug}.md`;
    await bucket.put(contentPath, content);

    // 2. Save metadata to D1
    if (type === 'post') {
      await db.prepare(
        'INSERT OR REPLACE INTO posts (id, title, slug, description, content_path, is_published) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        title,
        slug,
        description,
        contentPath,
        1
      ).run();
    } else if (type === 'portfolio') {
      await db.prepare(
        'INSERT OR REPLACE INTO portfolio (id, title, slug, description, year, content_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        title,
        slug,
        description,
        parseInt(extra) || new Date().getFullYear(),
        contentPath,
        1
      ).run();
    }

    return new Response(JSON.stringify({ success: true, path: contentPath }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const db = (env as any).OUTPOST_DB;
  const type = url.searchParams.get('type') || 'post';

  try {
    const table = type === 'post' ? 'posts' : 'portfolio';
    const { results } = await db.prepare(`SELECT * FROM ${table} ORDER BY ${type === 'post' ? 'pubDate' : 'year'} DESC`).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
