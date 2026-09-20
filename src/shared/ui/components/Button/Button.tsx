import { type ButtonHTMLAttributes } from 'react';
import React from 'react';

export type ButtonVariant = 'primary' | 'glass' | 'ghost' | 'danger';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

/** Раздел 6.1: высота 44-52px, radius/pill везде — заливка/текст/тень различают варианты. */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-text-inverse font-bold shadow-fab',
  glass:
    'border border-surface-glass-border bg-surface-glass text-text-primary shadow-md backdrop-blur-xl backdrop-saturate-150 hover:bg-surface-glass-strong',
  ghost: 'border-[1.5px] border-accent/60 bg-transparent text-accent hover:bg-accent-glow',
  danger: 'border border-danger/25 bg-danger-soft text-danger hover:bg-danger-soft/80',
};

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`inline-flex h-11 desktop:h-13 cursor-pointer items-center justify-center gap-2 rounded-full px-5 desktop:px-6 text-button font-sans transition-all duration-100 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
