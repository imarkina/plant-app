import ReactMarkdown, { type Components } from 'react-markdown';
import type { ChatMessage } from '../models/chat.types';
import { ToolStepIndicator } from './ToolStepIndicator';
import { Button } from '../../../shared/ui/components/Button/Button';

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="text-body whitespace-pre-wrap">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="text-body">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-bg-tertiary px-1 py-0.5 font-mono text-caption">{children}</code>
  ),
};

type Props = {
  message: ChatMessage;
  onRetry: (messageId: string) => void;
};

export const ChatMessageBubble = ({ message, onRetry }: Props) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-brand text-text-inverse'
            : 'border border-surface-glass-border bg-surface-glass backdrop-blur-xl backdrop-saturate-150'
        }`}
      >
        {/* parts только растёт и обновляется на месте, индекс как key безопасен */}
        {message.parts.map((part, index) =>
          part.kind === 'tool' ? (
            <ToolStepIndicator key={index} step={part.step} />
          ) : (
            <ReactMarkdown key={index} components={MARKDOWN_COMPONENTS}>
              {part.text}
            </ReactMarkdown>
          ),
        )}

        {message.status === 'streaming' && message.parts.length === 0 && (
          <span className="text-body text-text-muted">Думаю…</span>
        )}

        {message.status === 'stopped' && (
          <span className="text-caption text-text-muted">остановлено</span>
        )}

        {message.status === 'error' && (
          <div className="flex flex-col items-start gap-2">
            <span className="text-caption text-danger">{message.errorText}</span>
            <Button variant="primary" onClick={() => onRetry(message.id)}>
              Повторить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
