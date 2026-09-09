import { Search } from 'lucide-react';
import { ChipSelect, type ChipOption } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import type { HealthBucket } from '../models/report-status.mappers';
import { RoomChips } from './RoomChips';
import type { Location } from '../../locations';

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
  rooms: Location[];
};

export const CollectionFilters = ({ value, onChange, rooms }: Props) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-surface-glass-border bg-surface-glass px-4 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-card">
        <Search size={18} className="text-text-muted" />
        <input
          type="text"
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          placeholder="Найти растение..."
          className="flex-1 bg-transparent text-body font-sans text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>

      <RoomChips
        rooms={rooms}
        value={value.roomId}
        onChange={(roomId) => onChange({ ...value, roomId })}
      />

      <ChipSelect
        options={STATUS_OPTIONS}
        value={value.status}
        onChange={(status) => onChange({ ...value, status })}
      />
    </div>
  );
};
