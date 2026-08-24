import { comparePlants } from '../src/server/compare-plants';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    console.log('keys:', Object.keys(body));
    const { base64First, base64Last, analysisFirst, analysisLast, mimeType } = body;

    if (!base64First || !base64Last) {
      return Response.json({ error: 'no image' }, { status: 400 });
    }

    const result = await comparePlants({
      base64First,
      base64Last,
      analysisFirst,
      analysisLast,
      mimeType,
    });

    return Response.json({ result });
  } catch (e) {
    console.error('compare failed:', e);
    return Response.json({ error: 'compare failed' }, { status: 500 });
  }
}
