import { client } from './client';

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 768;

export async function embedText(text: string): Promise<number[]> {
  const response = await client.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { outputDimensionality: EMBEDDING_DIMENSIONS },
  });

  const values = response.embeddings?.[0]?.values;

  if (!values) {
    throw new Error('no embedding returned');
  }

  return values;
}
