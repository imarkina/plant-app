import React from 'react';

export type BadgeVariant = 'success' | 'danger' | 'neutral';
export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

/* success = accent/mint (раздел 2.1: "эко/здоровье"), отдельно от accent/iris —
   у этого бейджа только статусы здоровья растения/уверенность диагностики. */
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-brand-lime/15 text-brand-lime',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-bg-tertiary text-text-secondary',
};

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-caption font-sans ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
};
