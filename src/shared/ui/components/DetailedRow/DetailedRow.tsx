type Props = { title: string; text: string };
import './DetailedRow.css';

export const DetailRow = ({ title, text }: Props) => (
  <div className="comparison__detail-row">
    <p className="comparison__detail-title">{title}</p>
    <p className="comparison__detail-text">{text}</p>
  </div>
);
