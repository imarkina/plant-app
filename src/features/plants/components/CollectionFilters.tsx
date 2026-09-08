import { Search } from 'lucide-react';
import { ChipSelect, type ChipOption } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import type { HealthBucket } from '../models/report-status.mappers';

const STATUS_OPTIONS: ChipOption<HealthBucket>[] = [
  { value: 'healthy', label: 'Здорово' },
  { value: 'warning', label: 'Внимание' },
  { value: 'sick', label: 'Болеет' },
];

export const ALL_ROOMS_OPTION = '';
export const NO_ROOM_OPTION = '__none__';

export type CollectionFiltersValue = {
  search: string;
  roomId: string;
  status: HealthBucket | null;
};

type Props = {
  value: CollectionFiltersValue;
  onChange: (value: CollectionFiltersValue) => void;
  rooms: { id: string; name: string }[];
};

export const CollectionFilters = ({ value, onChange, rooms }: Props) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-surface-glass-border bg-bg-secondary px-3 py-2.5">
        <Search size={18} className="text-text-muted" />
        <input
          type="text"
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          placeholder="Поиск по названию"
          className="flex-1 bg-transparent text-body font-sans text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>

      <select
        value={value.roomId}
        onChange={(event) => onChange({ ...value, roomId: event.target.value })}
        className="rounded-xl border border-surface-glass-border bg-bg-secondary px-3 py-2.5 text-body-sm font-sans text-text-primary"
      >
        <option value={ALL_ROOMS_OPTION}>Все комнаты</option>
        <option value={NO_ROOM_OPTION}>Без комнаты</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>

      <ChipSelect
        options={STATUS_OPTIONS}
        value={value.status}
        onChange={(status) => onChange({ ...value, status })}
      />
    </div>
  );
};
