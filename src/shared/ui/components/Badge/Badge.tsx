import React from 'react';
import './Badge.css';

export type BadgeVariant = 'success' | 'danger' | 'neutral';
export type BadgeProps = {
  children: React.ReactNode;
  variant: BadgeVariant;
};

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};
