const EMBED_ENDPOINT = '/api/embed';
const EMBED_FAILED_MESSAGE = 'Не удалось получить embedding';

interface EmbedResponseBody {
  embedding: number[];
}

/** Клиентская обёртка — шлёт текст на свой сервер, получает вектор. Ключ Gemini остаётся на сервере. */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(EMBED_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(EMBED_FAILED_MESSAGE);
  }

  const responseBody: EmbedResponseBody = await response.json();
  return responseBody.embedding;
}
