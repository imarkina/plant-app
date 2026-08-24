import { analyzePlantImage } from '../src/server/analyze-plant-image';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const { image, mimeType } = await req.json();
    if (!image) {
      return Response.json({ error: 'no image' }, { status: 400 });
    }
    const result = await analyzePlantImage(image, mimeType);
    return Response.json({ result });
  } catch (e) {
    console.error('analyze failed:', e);
    return Response.json({ error: 'analysis failed' }, { status: 500 });
  }
}
