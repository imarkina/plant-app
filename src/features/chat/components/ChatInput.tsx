import { useState, type FormEvent } from 'react';
import { Send, Square } from 'lucide-react';

type Props = {
  disabled: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

export const ChatInput = ({ disabled, onSend, onStop }: Props) => {
  const [text, setText] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-[calc(96px+env(safe-area-inset-bottom))] flex items-center gap-2 rounded-full border border-surface-glass-border bg-surface-glass p-2 shadow-card backdrop-blur-xl backdrop-saturate-150 desktop:bottom-4"
    >
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Спросите об уходе за растением..."
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-body font-sans text-text-primary outline-none placeholder:text-text-muted"
      />
      {disabled ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Остановить"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-danger text-text-inverse transition-transform duration-100 active:scale-90"
        >
          <Square size={16} fill="currentColor" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Отправить"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-text-inverse transition-transform duration-100 active:scale-90 disabled:pointer-events-none disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      )}
    </form>
  );
};
