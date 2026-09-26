type Props = {
  className?: string;
};

/** Прямоугольная skeleton-заглушка с бегущим бликом (.skeleton, tokens.css) — форма/размер задаются через className (rounded-*, w-*, h-*). */
export const Skeleton = ({ className = '' }: Props) => (
  <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />
);
