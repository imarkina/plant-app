import './button.css';
import { type ButtonHTMLAttributes } from 'react';
import React from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
};

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  return (
    <button type="button" className={`btn btn--${variant}`} {...props}>
      {children}
    </button>
  );
};
