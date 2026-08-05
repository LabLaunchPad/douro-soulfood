/**
 * Serves an R2 object with correct HTTP Range support (206/416, Accept-Ranges,
 * Content-Range). Cloudflare Workers' static-asset (ASSETS) binding does not
 * support Range requests for files in public/, which iOS Safari requires for
 * <video> autoplay of larger files — see docs/runbook.md.
 *
 * 206 responses must never be cached (they're a partial view of the
 * resource), so Cache-Control is deliberately conservative here.
 */
export async function serveR2Range(request: Request, bucket: R2Bucket, key: string): Promise<Response> {
  const object = await bucket.head(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const size = object.size;
  const rangeHeader = request.headers.get('Range');

  const baseHeaders = new Headers();
  baseHeaders.set('Accept-Ranges', 'bytes');
  baseHeaders.set('Content-Type', object.httpMetadata?.contentType ?? 'application/octet-stream');
  baseHeaders.set('ETag', object.httpEtag);

  if (!rangeHeader) {
    const full = await bucket.get(key);
    if (!full) return new Response('Not Found', { status: 404 });
    baseHeaders.set('Content-Length', String(size));
    baseHeaders.set('Cache-Control', 'public, max-age=3600');
    return new Response(full.body, { status: 200, headers: baseHeaders });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match || (match[1] === '' && match[2] === '')) {
    baseHeaders.set('Content-Range', `bytes */${size}`);
    return new Response('Invalid Range', { status: 416, headers: baseHeaders });
  }

  let start = match[1] === '' ? undefined : parseInt(match[1], 10);
  let end = match[2] === '' ? undefined : parseInt(match[2], 10);

  // Suffix range: "bytes=-500" means the last 500 bytes.
  if (start === undefined) {
    start = Math.max(size - (end as number), 0);
    end = size - 1;
  } else if (end === undefined || end >= size) {
    end = size - 1;
  }

  if (start > end || start >= size) {
    baseHeaders.set('Content-Range', `bytes */${size}`);
    return new Response('Range Not Satisfiable', { status: 416, headers: baseHeaders });
  }

  const length = end - start + 1;
  const ranged = await bucket.get(key, { range: { offset: start, length } });
  if (!ranged) return new Response('Not Found', { status: 404 });

  baseHeaders.set('Content-Range', `bytes ${start}-${end}/${size}`);
  baseHeaders.set('Content-Length', String(length));
  // Partial responses are never cached — a shared cache serving a 206 back
  // as if it were the full object would corrupt playback for other clients.
  baseHeaders.set('Cache-Control', 'no-store');

  return new Response(ranged.body, { status: 206, headers: baseHeaders });
}
