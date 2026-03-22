import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const db = (env as any).OUTPOST_DB;
  const bucket = (env as any).OUTPOST_STORAGE;

  try {
    const data = await request.formData();
    const type = data.get('type') as string;

    if (type === 'place') {
      const name = data.get('title') as string;
      const lat = parseFloat(data.get('lat') as string);
      const lng = parseFloat(data.get('lng') as string);
      const note = data.get('content') as string;
      const image = data.get('image') as File;

      let imagePath = '';
      if (image && image.size > 0) {
        imagePath = `places/${crypto.randomUUID()}-${image.name}`;
        await bucket.put(imagePath, await image.arrayBuffer(), {
          httpMetadata: { contentType: image.type }
        });
      }

      await db.prepare(
        'INSERT INTO places (id, name, lat, lng, note, image_path) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), name, lat, lng, note, imagePath).run();

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const title = data.get('title') as string;
    const slug = data.get('slug') as string;
    const description = data.get('description') as string;
    const content = data.get('content') as string;
    const extra = data.get('extra') as string;

    if (!title || !slug || !content || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const contentPath = `${type}s/${slug}.md`;
    await bucket.put(contentPath, content);

    if (type === 'post') {
      await db.prepare(
        'INSERT OR REPLACE INTO posts (id, title, slug, description, content_path, is_published) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), title, slug, description, contentPath, 1).run();
    } else if (type === 'portfolio') {
      await db.prepare(
        'INSERT OR REPLACE INTO portfolio (id, title, slug, description, year, content_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), title, slug, description, parseInt(extra) || new Date().getFullYear(), contentPath, 1).run();
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
    let results;
    if (type === 'place') {
      const query = await db.prepare('SELECT * FROM places ORDER BY visit_date DESC').all();
      results = query.results;
    } else {
      const table = type === 'post' ? 'posts' : 'portfolio';
      const query = await db.prepare(`SELECT * FROM ${table} ORDER BY ${type === 'post' ? 'pubDate' : 'year'} DESC`).all();
      results = query.results;
    }
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
