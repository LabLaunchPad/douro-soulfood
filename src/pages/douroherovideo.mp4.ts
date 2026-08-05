import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { serveR2Range } from '@/lib/media/rangeResponse';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return serveR2Range(request, env.MEDIA, 'douroherovideo.mp4');
};
