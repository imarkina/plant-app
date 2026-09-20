import { DoorOpen } from 'lucide-react';
import type { Location } from '../../locations';
import { roomIcon } from '../../locations';
import { ALL_ROOMS_OPTION, NO_ROOM_OPTION } from './CollectionFilters';

type Props = {
  rooms: Location[];
  value: string;
  onChange: (roomId: string) => void;
};

const CHIP_BASE =
  'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-sans font-medium transition-all duration-100 active:scale-[0.97]';
const CHIP_ACTIVE = 'bg-bg-elevated text-accent shadow-card';
const CHIP_INACTIVE =
  'border border-surface-glass-border bg-surface-glass text-text-secondary hover:text-text-primary';

export const RoomChips = ({ rooms, value, onChange }: Props) => {
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange(ALL_ROOMS_OPTION)}
        className={`${CHIP_BASE} ${value === ALL_ROOMS_OPTION ? CHIP_ACTIVE : CHIP_INACTIVE}`}
      >
        Все
      </button>

      {rooms.map((room) => {
        const Icon = roomIcon(room.name);
        const isActive = value === room.id;

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onChange(room.id)}
            className={`${CHIP_BASE} ${isActive ? CHIP_ACTIVE : CHIP_INACTIVE}`}
          >
            <Icon size={14} />
            {room.name}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(NO_ROOM_OPTION)}
        className={`${CHIP_BASE} ${value === NO_ROOM_OPTION ? CHIP_ACTIVE : CHIP_INACTIVE}`}
      >
        <DoorOpen size={14} />
        Без комнаты
      </button>
    </div>
  );
};
