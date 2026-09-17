type Props = {
  emoji: string;
  title: string;
  description: string;
};

/** Заглушка для ещё не построенных экранов ИА — единый вид вместо голого текста. */
export const ComingSoon = ({ emoji, title, description }: Props) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
    <div className="flex size-16 items-center justify-center rounded-3xl border border-surface-glass-border bg-surface-glass text-3xl shadow-card backdrop-blur-xl backdrop-saturate-150">
      {emoji}
    </div>
    <h2 className="mt-4 text-h2 text-text-primary">{title}</h2>
    <p className="mt-2 max-w-xs text-body-sm text-text-muted">{description}</p>
    <span className="mt-4 rounded-full bg-brand px-4 py-1.5 text-caption font-semibold text-white">
      Скоро
    </span>
  </div>
);
