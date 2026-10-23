export const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export const pluralDays = (n: number): string => pluralizeRu(n, 'день', 'дня', 'дней');

export const pluralizeRu = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }

  return many;
};

export function deriveDisplayName(email: string | null): string {
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

export const formatInterval = (days: number): string => {
  if (days === 7) {
    return 'Неделя';
  }

  if (days === 14) {
    return '2 недели';
  }

  if (days === 30) {
    return 'Месяц';
  }

  return `${days} ${pluralDays(days)}`;
};
