type Props = {
  message: string | null;
};

export const Toast = ({ message }: Props) => {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-24 z-[var(--z-toast)] flex justify-center px-4">
      <div className="rounded-full bg-bg-elevated px-4 py-2.5 text-body-sm font-semibold text-text-primary shadow-elevated">
        {message}
      </div>
    </div>
  );
};
