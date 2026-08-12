import React, { type HTMLAttributes } from 'react';
import './Card.css';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  title?: string;
};

export const Card = ({ children, title, className = '', ...rest }: CardProps) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {title && <p className="card-title">{title}</p>}
      {children}
    </div>
  );
};
