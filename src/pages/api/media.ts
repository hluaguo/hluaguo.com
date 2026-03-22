import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ url }) => {
  const bucket = (env as any).OUTPOST_STORAGE;
  const path = url.searchParams.get('path');

  if (!path) {
    return new Response('Missing path', { status: 400 });
  }

  try {
    const object = await bucket.get(path);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(object.body, {
      headers,
    });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
};
