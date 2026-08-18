import './UploadZone.css';
import type { ChangeEvent } from 'react';
import { Camera } from 'lucide-react';

type Props = {
  loading: boolean;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const UploadZone = ({ onFileSelect, loading }: Props) => {
  return (
    <label className="upload-zone">
      <input type="file" accept="image/*" onChange={onFileSelect} className="upload-zone__input" />
      <div className="upload-zone__icon">
        <Camera size={28} strokeWidth={2} />
      </div>
      <p className="upload-zone__title">{loading ? 'Анализируем...' : 'Загрузите фото растения'}</p>
      <p className="upload-zone__subtitle">Определим вид, состояние и план ухода</p>
    </label>
  );
};
