import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const db = (env as any).OUTPOST_DB;
  const bucket = (env as any).OUTPOST_STORAGE;
  const adminKey = (env as any).ADMIN_KEY;

  try {
    const data = await request.formData();
    const providedKey = data.get('key') as string;

    if (!adminKey || providedKey !== adminKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized Access' }), { status: 401 });
    }

    const id = (data.get('id') as string) || crypto.randomUUID();
    const type = data.get('type') as string;
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const image = data.get('image') as File;

    let imagePath = data.get('existing_image_path') as string || '';
    if (image && image.size > 0) {
      imagePath = `media/${crypto.randomUUID()}-${image.name}`;
      await bucket.put(imagePath, await image.arrayBuffer(), {
        httpMetadata: { contentType: image.type }
      });
    }

    if (type === 'place') {
      const lat = parseFloat(data.get('lat') as string);
      const lng = parseFloat(data.get('lng') as string);
      await db.prepare(
        'INSERT OR REPLACE INTO places (id, name, lat, lng, note, image_path) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, title, lat, lng, content, imagePath).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const slug = data.get('slug') as string;
    const description = data.get('description') as string;
    const extra = data.get('extra') as string;

    if (!title || !slug || !content || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const contentPath = `${type}s/${slug}.md`;
    await bucket.put(contentPath, content);

    if (type === 'post') {
      await db.prepare(
        'INSERT OR REPLACE INTO posts (id, title, slug, description, content_path, image_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, title, slug, description, contentPath, imagePath, 1).run();
    } else if (type === 'portfolio') {
      await db.prepare(
        'INSERT OR REPLACE INTO portfolio (id, title, slug, description, year, content_path, image_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, title, slug, description, parseInt(extra) || new Date().getFullYear(), contentPath, imagePath, 1).run();
    }

    return new Response(JSON.stringify({ success: true, path: contentPath }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const db = (env as any).OUTPOST_DB;
  const bucket = (env as any).OUTPOST_STORAGE;
  const type = url.searchParams.get('type') || 'post';
  const id = url.searchParams.get('id');

  try {
    // Single record fetch with content for editing
    if (id) {
      const table = type === 'place' ? 'places' : (type === 'post' ? 'posts' : 'portfolio');
      const record = await db.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
      
      if (!record) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

      // If it's a post or portfolio, fetch the markdown content from R2
      let content = '';
      if (type === 'place') {
        content = record.note;
      } else {
        const obj = await bucket.get(record.content_path);
        if (obj) content = await obj.text();
      }

      return new Response(JSON.stringify({ ...record, content }), { status: 200 });
    }

    // List records
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
