import type { ChatEvent } from './chat.types';
import { createStreamDecoder, extractSseEvents, parseChatEvent } from './sse-parser';

export async function* streamChat(
  message: string,
  chatId: string,
  signal: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const response = await fetch(`${import.meta.env.VITE_AGENT_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ chat_id: chatId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`agent request failed: HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decode = createStreamDecoder();

  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decode(value);
      const { events, remainder } = extractSseEvents(buffer, chunkText);
      buffer = remainder;

      for (const raw of events) {
        yield parseChatEvent(raw);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
