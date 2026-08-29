import { Camera } from 'lucide-react';
import { formatInterval } from '../../../helpers';
import { useState } from 'react';
import './PhotoReminderSetup.css';

type Props = {
  onCreate: (intervalDays: number) => void;
};

export const PhotoReminderSetup = ({ onCreate }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [interval, setInterval] = useState(14);

  const presets = [7, 14, 30];

  if (!showForm) {
    return (
      <button className="care-add-btn" onClick={() => setShowForm(true)}>
        <Camera size={18} /> Напоминать фотографировать
      </button>
    );
  }

  return (
    <div className="photo-setup">
      <p className="photo-setup__label">Как часто напоминать сделать фото?</p>
      <div className="photo-setup__presets">
        {presets.map((days) => (
          <button
            key={days}
            className={interval === days ? 'preset preset--active' : 'preset'}
            onClick={() => setInterval(days)}
          >
            {formatInterval(days)}
          </button>
        ))}
      </div>
      <button className="photo-setup__confirm" onClick={() => onCreate(interval)}>
        Создать напоминание
      </button>
    </div>
  );
};
