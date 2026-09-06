import { embedText } from '../src/server/embed-text';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: 'no text' }, { status: 400 });
    }

    const embedding = await embedText(text);

    return Response.json({ embedding });
  } catch (e) {
    console.error('embed failed:', e);
    return Response.json({ error: 'embed failed' }, { status: 500 });
  }
}
