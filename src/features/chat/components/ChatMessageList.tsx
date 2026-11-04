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
    // behavior: 'auto' — не smooth: при стриминге messages обновляется на
    // каждый TEXT_DELTA (много раз в секунду), и каждый smooth-вызов обрывал
    // предыдущую анимацию скролла на середине — это и дёргало страницу
    // (вместе с ней — sticky ChatInput).
    bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <p className="mt-6 text-body-sm text-text-muted">
        Спросите что-нибудь об уходе за растениями.
      </p>
    );
  }

  return (
    // pb с запасом под sticky ChatInput (bottom-смещение + его собственная
    // высота) — иначе последние строки последнего сообщения прячутся под
    // ним. На мобиле запас больше: там у ChatInput ещё и отступ от
    // плавающего BottomNav (bottom-[calc(96px+...)]).
    <div className="mt-4 flex flex-col gap-3 pb-36 desktop:pb-20">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
