import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { analyzePlantImage } from './analize/analyze-plant-image.ts';
const app = new Hono();

app.use('/api/*', cors({ origin: 'http://localhost:5173' }));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/api/analyze', async (c) => {
  try {
    const body = await c.req.formData();
    const image = body.get('image');

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString('base64');
      const analyzedResult = await analyzePlantImage(base64String, image.type);
      return c.json({ result: analyzedResult });
    }

    return c.json({ result: undefined });
  } catch (e) {
    console.error('analyze failed:', e);
    return c.json({ error: 'analysis failed' }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
