import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../models/chat.types';
import { ChatMessageBubble } from './ChatMessageBubble';

type Props = {
  messages: ChatMessage[];
  onRetry: (messageId: string) => void;
};

export const ChatMessageList = ({ messages, onRetry }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <p className="mt-6 text-body-sm text-text-muted">
        Спросите что-нибудь об уходе за растениями.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 pb-4">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
