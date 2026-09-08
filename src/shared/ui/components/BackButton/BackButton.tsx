import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = () => {
  return (
    <Link
      to="/"
      className="mb-4 inline-flex size-10 desktop:size-11 items-center justify-center rounded-md desktop:rounded-lg border border-surface-glass-border bg-bg-tertiary text-text-primary transition-all duration-100 hover:bg-bg-secondary active:scale-[0.9]"
    >
      <ArrowLeft size={20} />
    </Link>
  );
};
