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
    // pb — запас на случай, когда вниз докручивают вручную (а не через
    // scrollIntoView). scroll-mb на сентинеле — для самого scrollIntoView:
    // block:'end' иначе подводит контент вплотную к краю вьюпорта и
    // "съедает" любой pb родителя (он просто уезжает за экран вместе с
    // контентом) — scroll-margin браузер учитывает при вычислении, докуда
    // скроллить, так что именно он и держит зазор под sticky ChatInput.
    // На мобиле запас больше: там у ChatInput ещё и отступ от плавающего
    // BottomNav (bottom-[calc(96px+...)]).
    <div className="mt-4 flex flex-col gap-3 pb-36 desktop:pb-20">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
      <div ref={bottomRef} className="scroll-mb-36 desktop:scroll-mb-20" />
    </div>
  );
};
