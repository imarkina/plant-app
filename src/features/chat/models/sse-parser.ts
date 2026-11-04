import type { ChatEvent } from './chat.types';

export interface RawSseEvent {
  event: string;
  data: string;
}

function splitField(line: string): { field: string; value: string } | null {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;

  const field = line.slice(0, colonIndex);
  const rawValue = line.slice(colonIndex + 1);

  const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

  return { field, value };
}

function parseEventBlock(block: string): RawSseEvent {
  let event = '';
  const dataLines: string[] = [];

  for (const line of block.split('\n')) {
    if (line === '') continue;

    const parsed = splitField(line);
    if (!parsed) continue;

    if (parsed.field === 'event') {
      event = parsed.value;
    } else if (parsed.field === 'data') {
      dataLines.push(parsed.value);
    }
  }

  return { event, data: dataLines.join('\n') };
}

export function extractSseEvents(
  buffer: string,
  chunk: string,
): { events: RawSseEvent[]; remainder: string } {
  const combined = (buffer + chunk).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const blocks = combined.split('\n\n');
  const remainder = blocks.pop() ?? '';

  const events = blocks.filter((block) => block.length > 0).map(parseEventBlock);

  return { events, remainder };
}

export function createStreamDecoder() {
  const decoder = new TextDecoder();
  return (bytes: Uint8Array) => decoder.decode(bytes, { stream: true });
}

export function parseChatEvent(raw: RawSseEvent): ChatEvent {
  return JSON.parse(raw.data) as ChatEvent;
}
