import { type ReactNode, useState } from 'react';
import { ChevronRight, Download, LogOut, Moon, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../features/auth';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { useLocations } from '../../features/locations/hooks/useLocations';
import { lightLevelLabel, roomIcon } from '../../features/locations';
import { useTheme } from '../../shared/ui/hooks/useTheme';
import { Switch } from '../../shared/ui/components/Switch/Switch';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { formatDate, pluralizeRu } from '../../shared/helpers';

function deriveDisplayName(email: string | null): string {
  if (!email) {
    return 'Без имени';
  }

  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const StatTile = ({ value, label }: { value: number; label: string }) => (
  <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-4 text-center shadow-card backdrop-blur-xl">
    <p className="text-h2 text-text-primary">{value}</p>
    <p className="mt-1 text-caption text-text-muted">{label}</p>
  </div>
);

const SettingsRow = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-3 py-3">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-text-secondary">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-body-sm font-semibold text-text-primary">{title}</p>
      <p className="truncate text-caption text-text-muted">{subtitle}</p>
    </div>
    {children}
  </div>
);

export const ProfilePage = () => {
  const { user, signOut } = useAuthContext();
  const { plants } = usePlantsContext();
  const { locations } = useLocations();
  const { theme, toggle } = useTheme();
  const [exported, setExported] = useState(false);

  const activePlants = plants.filter((plant) => !plant.isArchived);
  const photosCount = activePlants.reduce((sum, plant) => sum + plant.photos.length, 0);

  const plantsByLocation = new Map<string, number>();
  for (const plant of activePlants) {
    if (plant.locationId) {
      plantsByLocation.set(plant.locationId, (plantsByLocation.get(plant.locationId) ?? 0) + 1);
    }
  }

  const handleExport = () => {
    downloadJson(`plant-parent-os-export-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      locations,
      plants: activePlants.map((plant) => ({
        ...plant,
        photos: plant.photos.map((photo) => ({
          id: photo.id,
          createdAt: photo.createdAt,
          imageUrl: photo.imageUrl,
          analysis: photo.analysis,
          isAvatar: photo.isAvatar,
        })),
      })),
    });
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div>
      <div className="mt-2 flex flex-col items-center text-center">
        <div className="relative size-24">
          <div className="size-full rounded-full bg-brand p-[3px]">
            <div className="flex size-full items-center justify-center rounded-full bg-bg-elevated">
              <User size={40} className="text-text-muted" />
            </div>
          </div>
          <div className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-brand text-white shadow-card ring-4 ring-bg-primary">
            🌿
          </div>
        </div>

        <h1 className="mt-4 text-h1 text-text-primary">{deriveDisplayName(user?.email ?? null)}</h1>
        <p className="mt-1 text-body text-text-muted">{user?.email ?? '—'}</p>
        {user?.createdAt && (
          <p className="mt-1 text-caption text-text-muted">
            На платформе с {formatDate(new Date(user.createdAt).getTime())}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatTile value={activePlants.length} label={pluralizeRu(activePlants.length, 'растение', 'растения', 'растений')} />
        <StatTile value={locations.length} label={pluralizeRu(locations.length, 'комната', 'комнаты', 'комнат')} />
        <StatTile value={photosCount} label={pluralizeRu(photosCount, 'фото', 'фото', 'фото')} />
      </div>

      <div className="mt-6 rounded-3xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl">
        <p className="text-label text-text-muted uppercase">Настройки</p>
        <div className="mt-1 divide-y divide-surface-glass-border">
          <SettingsRow icon={<Moon size={18} />} title="Тёмная тема" subtitle="Переключить оформление">
            <Switch checked={theme === 'dark'} onChange={toggle} label="Тёмная тема" />
          </SettingsRow>

          <SettingsRow icon="📡" title="Офлайн-режим" subtitle="Работа без интернета">
            <span className="text-body-sm font-semibold text-accent">Активен</span>
          </SettingsRow>

          <button type="button" onClick={handleExport} className="w-full cursor-pointer text-left">
            <SettingsRow icon={<Download size={18} />} title="Экспорт данных" subtitle="Скачать коллекцию в JSON">
              <span className="text-body-sm font-semibold text-text-secondary">
                {exported ? 'Готово ✓' : ''}
              </span>
            </SettingsRow>
          </button>
        </div>
      </div>

      {locations.length > 0 && (
        <div className="mt-6 rounded-3xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl">
          <p className="text-label text-text-muted uppercase">Локации</p>
          <div className="mt-1 divide-y divide-surface-glass-border">
            {locations.map((location) => {
              const RoomIcon = roomIcon(location.name);
              const count = plantsByLocation.get(location.id) ?? 0;
              const lightLabel = lightLevelLabel(location.lightLevel);

              return (
                <Link
                  key={location.id}
                  to="/locations"
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-text-secondary">
                    <RoomIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-semibold text-text-primary">{location.name}</p>
                    <p className="truncate text-caption text-text-muted">
                      {count} {pluralizeRu(count, 'растение', 'растения', 'растений')}
                      {lightLabel ? ` · ${lightLabel}` : ''}
                    </p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-text-muted" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-danger-soft bg-danger-soft px-5 py-3.5 text-button font-sans font-semibold text-danger"
      >
        <LogOut size={18} />
        Выйти из аккаунта
      </button>

      <BottomNav />
    </div>
  );
};
