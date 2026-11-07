import type { ChatEvent } from './chat.types';
import { createStreamDecoder, extractSseEvents, parseChatEvent } from './sse-parser';
import { supabase } from '../../../shared/supabase/client';

export async function* streamChat(
  message: string,
  chatId: string,
  signal: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const { data } = await supabase.auth.getSession();

  const token = data.session?.access_token;

  if (!token) {
    throw new Error('authorization required');
  }

  const response = await fetch(`${import.meta.env.VITE_AGENT_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
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
