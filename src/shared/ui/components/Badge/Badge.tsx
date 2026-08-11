import React from 'react';
import './Badge.css';

export type BadgeProps = {
  children: React.ReactNode;
  variant: 'success' | 'danger' | 'neutral';
};

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};
