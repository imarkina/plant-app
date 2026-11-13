const GOOGLE_BASE = 'https://generativelanguage.googleapis.com';

const { GEMINI_PROXY_SECRET, GEMINI_API_KEY } = process.env;

export async function handler(req: Request): Promise<Response> {
  if (!GEMINI_PROXY_SECRET || !GEMINI_API_KEY) {
    return Response.json({ error: 'Proxy is not configured' }, { status: 500 });
  }

  const proxySecret = req.headers.get('X-Proxy-Secret');

  if (proxySecret !== GEMINI_PROXY_SECRET) {
    return Response.json({ error: 'not authorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const path = url.searchParams.get('path');

  searchParams.delete('path');

  if (!path) {
    return Response.json({ error: 'path is required' }, { status: 400 });
  }

  const proxyUrl = new URL(path, GOOGLE_BASE);
  const upstream = await fetch(`${proxyUrl}?${searchParams}`, {
    method: req.method,
    body: req.method === 'GET' ? undefined : await req.text(),
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
  });
  // отдаём ответ потоком, не дожидаясь конца — это пригодится для стриминга
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}

export const POST = handler;
export const GET = handler;