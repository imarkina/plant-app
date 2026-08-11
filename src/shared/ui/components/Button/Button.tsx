import './button.css';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant: 'primary' | 'secondary';
};

export const Button = ({ variant = 'primary', label, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={['btn', `btn--${variant}`].join(' ')}

      {...props}
    >
      {label}
    </button>
  );
};
