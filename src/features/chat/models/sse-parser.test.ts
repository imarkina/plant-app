import { describe, expect, it } from 'vitest';
import { createStreamDecoder, extractSseEvents, parseChatEvent } from './sse-parser';

describe('extractSseEvents', () => {
  it('buffers an event split across two chunks', () => {
    const first = extractSseEvents('', 'event: DONE\nda');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(first.events).toEqual([]);
    expect(first.remainder).toBe('event: DONE\nda');

    const second = extractSseEvents(first.remainder, 'ta: {"type":"DONE"}\n\n');
    expect(second.events).toEqual([{ event: 'DONE', data: '{"type":"DONE"}' }]);
    expect(second.remainder).toBe('');
  });

  it('parses two events delivered in a single chunk', () => {
    const chunk =
      'event: TOOL_START\ndata: {"type":"TOOL_START","tool":"get_weather"}\n\n' +
      'event: TEXT_DELTA\ndata: {"type":"TEXT_DELTA","text":"Hi"}\n\n';

    const { events, remainder } = extractSseEvents('', chunk);

    expect(events).toEqual([
      { event: 'TOOL_START', data: '{"type":"TOOL_START","tool":"get_weather"}' },
      { event: 'TEXT_DELTA', data: '{"type":"TEXT_DELTA","text":"Hi"}' },
    ]);
    expect(remainder).toBe('');
  });

  it('ignores stray blank lines between events (keep-alives)', () => {
    const { events, remainder } = extractSseEvents(
      '',
      'event: DONE\ndata: {"type":"DONE"}\n\n\n\n',
    );

    expect(events).toEqual([{ event: 'DONE', data: '{"type":"DONE"}' }]);
    expect(remainder).toBe('');
  });

  it('strips at most one space after the colon, and tolerates none', () => {
    const { events } = extractSseEvents('', 'event:DONE\ndata:{"type":"DONE"}\n\n');
    expect(events).toEqual([{ event: 'DONE', data: '{"type":"DONE"}' }]);
  });
});

describe('createStreamDecoder', () => {
  it('reassembles a UTF-8 character split mid-byte across two decode() calls', () => {
    const original = 'привет';
    const bytes = new TextEncoder().encode(original);
    const decode = createStreamDecoder();

    // 'п' кодируется двумя байтами (0xD0 0xBF) — режем ровно между ними.
    const firstChunk = bytes.slice(0, 1);
    const secondChunk = bytes.slice(1);

    const firstResult = decode(firstChunk);
    const secondResult = decode(secondChunk);

    expect(firstResult + secondResult).toBe(original);
  });

  it('keeps each decoder instance independent', () => {
    const decodeA = createStreamDecoder();
    const decodeB = createStreamDecoder();

    expect(decodeA(new TextEncoder().encode('a'))).toBe('a');
    expect(decodeB(new TextEncoder().encode('b'))).toBe('b');
  });
});

describe('parseChatEvent', () => {
  it('parses every event type from its raw data payload', () => {
    expect(
      parseChatEvent({ event: 'TOOL_START', data: '{"type":"TOOL_START","tool":"get_weather"}' }),
    ).toEqual({ type: 'TOOL_START', tool: 'get_weather' });

    expect(
      parseChatEvent({
        event: 'TOOL_END',
        data: '{"type":"TOOL_END","tool":"get_weather","ok":true}',
      }),
    ).toEqual({ type: 'TOOL_END', tool: 'get_weather', ok: true });

    expect(
      parseChatEvent({ event: 'TEXT_DELTA', data: '{"type":"TEXT_DELTA","text":"Hi"}' }),
    ).toEqual({ type: 'TEXT_DELTA', text: 'Hi' });

    expect(parseChatEvent({ event: 'DONE', data: '{"type":"DONE"}' })).toEqual({ type: 'DONE' });

    expect(parseChatEvent({ event: 'ERROR', data: '{"type":"ERROR","text":"boom"}' })).toEqual({
      type: 'ERROR',
      text: 'boom',
    });
  });
});
