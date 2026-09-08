import React, { type HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  title?: string;
};

export const Card = ({ children, title, className = '', ...rest }: CardProps) => {
  return (
    <div
      className={`rounded-2xl desktop:rounded-3xl border border-surface-glass-border bg-bg-secondary p-4 desktop:p-5 shadow-card ${className}`}
      {...rest}
    >
      {title && (
        <p className="mb-4 flex items-center gap-2 text-h3 desktop:text-h3-lg text-text-primary">
          {title}
        </p>
      )}
      {children}
    </div>
  );
};
