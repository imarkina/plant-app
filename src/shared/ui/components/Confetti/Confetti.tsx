import { useEffect, useState } from 'react';

const COLORS = [
  'var(--color-accent)',
  'var(--color-brand-pink)',
  'var(--color-brand-purple)',
  'var(--color-brand-blue)',
];
const PIECE_COUNT = 24;
const LIFETIME_MS = 1900;

type Piece = { id: number; left: number; color: string; delay: number; duration: number; rotate: number };

function createPieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    color: COLORS[id % COLORS.length],
    delay: Math.random() * 0.3,
    duration: 1.4 + Math.random() * 0.6,
    rotate: Math.random() * 360,
  }));
}

type Props = {
  active: boolean;
  onDone?: () => void;
};

/** Lightweight CSS-only confetti burst, no external library. */
export const Confetti = ({ active, onDone }: Props) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) {
      return;
    }

    queueMicrotask(() => setPieces(createPieces()));
    const timer = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, LIFETIME_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (pieces.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[var(--z-toast)] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-12px] size-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};
