import React from 'react';

type AdjustmentCardProps = {
  variant: 'keep' | 'urgent' | 'watch';
  icon: React.ReactNode;
  title: string;
  items: string[];
};

const VARIANT_CLASSES: Record<AdjustmentCardProps['variant'], string> = {
  keep: 'bg-brand-lime/12 text-brand-lime',
  urgent: 'bg-danger-soft text-danger',
  watch: 'bg-bg-tertiary text-text-muted',
};

export const AdjustmentCard = ({ variant, icon, title, items }: AdjustmentCardProps) => (
  <div className={`rounded-xl p-3 ${VARIANT_CLASSES[variant]}`}>
    <div className="mb-1.5 flex items-center gap-1.5">
      <span className="flex items-center">{icon}</span>
      <span className="text-body-sm font-semibold">{title}</span>
    </div>
    <p className="text-body-sm leading-relaxed">{items.join(' · ')}</p>
  </div>
);
