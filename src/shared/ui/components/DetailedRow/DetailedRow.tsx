type Props = { title: string; text: string };

export const DetailRow = ({ title, text }: Props) => (
  <div>
    <p className="text-body-sm font-semibold text-text-primary">{title}</p>
    <p className="mt-0.5 text-body-sm leading-relaxed text-text-muted">{text}</p>
  </div>
);
