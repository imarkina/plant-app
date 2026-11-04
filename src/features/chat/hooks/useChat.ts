import { useCallback, useRef, useState } from 'react';
import type { ChatEvent, ChatMessage, MessagePart } from '../models/chat.types';
import { streamChat } from '../models/chat.client';

function findLastRunningToolIndex(parts: MessagePart[], tool: string): number {
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part.kind === 'tool' && part.step.tool === tool && part.step.status === 'running') {
      return i;
    }
  }
  return -1;
}

function applyEvent(message: ChatMessage, event: ChatEvent): ChatMessage {
  switch (event.type) {
    case 'TOOL_START': {
      const parts: MessagePart[] = [
        ...message.parts,
        { kind: 'tool', step: { tool: event.tool, status: 'running' } },
      ];
      return { ...message, parts };
    }
    case 'TOOL_END': {
      const index = findLastRunningToolIndex(message.parts, event.tool);
      if (index === -1) return message;

      const part = message.parts[index];
      if (part.kind !== 'tool') return message;

      const parts = [...message.parts];
      parts[index] = { ...part, step: { ...part.step, status: event.ok ? 'done' : 'failed' } };
      return { ...message, parts };
    }
    case 'TEXT_DELTA': {
      const last = message.parts[message.parts.length - 1];
      if (last?.kind === 'text') {
        const parts = [...message.parts];
        parts[parts.length - 1] = { kind: 'text', text: last.text + event.text };
        return { ...message, parts };
      }
      return { ...message, parts: [...message.parts, { kind: 'text', text: event.text }] };
    }
    case 'DONE':
      return { ...message, status: 'done' };
    case 'ERROR':
      return { ...message, status: 'error', errorText: event.text };
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

export function useChat() {
  const [chatId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateLastMessage = useCallback((updater: (message: ChatMessage) => ChatMessage) => {
    setMessages((current) => {
      if (current.length === 0) return current;
      const next = [...current];
      next[next.length - 1] = updater(next[next.length - 1]);
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [{ kind: 'text', text }],
        status: 'done',
      };
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [],
        status: 'streaming',
      };

      setMessages((current) => [...current, userMessage, assistantMessage]);
      setSending(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        for await (const event of streamChat(text, chatId, controller.signal)) {
          updateLastMessage((message) => applyEvent(message, event));
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          updateLastMessage((message) => ({ ...message, status: 'stopped' }));
        } else {
          const errorText = e instanceof Error ? e.message : 'Не удалось получить ответ';
          updateLastMessage((message) => ({ ...message, status: 'error', errorText }));
        }
      } finally {
        setSending(false);
        abortControllerRef.current = null;
      }
    },
    [chatId, updateLastMessage],
  );

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const retry = useCallback(
    (messageId: string) => {
      const index = messages.findIndex((message) => message.id === messageId);
      if (index <= 0) return;

      const previousUserMessage = messages[index - 1];
      const firstPart = previousUserMessage.parts[0];
      if (previousUserMessage.role !== 'user' || firstPart?.kind !== 'text') return;

      const text = firstPart.text;
      // Убираем и упавший ответ, и повторяемый вопрос - sendMessage создаст обе
      // реплики заново, чтобы не показывать один и тот же вопрос дважды подряд
      setMessages((current) => current.slice(0, index - 1));
      void sendMessage(text);
    },
    [messages, sendMessage],
  );

  return { messages, sending, sendMessage, stop, retry };
}
