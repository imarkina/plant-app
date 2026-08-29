import React from 'react';
import './AdjustmentCard.css';

type AdjustmentCardProps = {
  variant: 'keep' | 'urgent' | 'watch';
  icon: React.ReactNode;
  title: string;
  items: string[];
};

export const AdjustmentCard = ({ variant, icon, title, items }: AdjustmentCardProps) => (
  <div className={`action-card action-card--${variant}`}>
    <div className="action-card__header">
      <span className="action-card__icon">{icon}</span>
      <span className="action-card__title">{title}</span>
    </div>
    <p className="action-card__text">{items.join(' · ')}</p>
  </div>
);
