import type { ReactNode } from 'react';
import './CareItem.css';

type CareItemProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export const CareItem = ({ title, children, fullWidth = false }: CareItemProps) => {
  return (
    <div className="care-item" style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
      <h4>{title}</h4>
      {children}
    </div>
  );
};
