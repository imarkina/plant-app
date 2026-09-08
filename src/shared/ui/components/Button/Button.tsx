import { type ButtonHTMLAttributes } from 'react';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'h-11 desktop:h-12 rounded-lg desktop:rounded-xl px-5 desktop:px-6 bg-accent text-text-inverse hover:bg-accent-hover',
  secondary:
    'h-11 desktop:h-12 rounded-lg desktop:rounded-xl px-5 desktop:px-6 border border-surface-glass-border bg-bg-tertiary text-text-primary hover:bg-bg-secondary',
  ghost:
    'h-9 desktop:h-10 rounded-sm desktop:rounded-md px-3 desktop:px-4 bg-transparent text-text-primary hover:bg-bg-tertiary',
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 text-button font-sans transition-all duration-100 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
