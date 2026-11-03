import { describe, expect, it } from 'vitest';
import { deriveDisplayName, formatInterval, pluralizeRu } from './helpers';

describe('pluralizeRu', () => {
  it.each([
    [1, 'день'],
    [21, 'день'],
    [2, 'дня'],
    [3, 'дня'],
    [4, 'дня'],
    [24, 'дня'],
    [5, 'дней'],
    [11, 'дней'],
    [0, 'дней'],
  ])('picks the right form for %i', (n, expected) => {
    expect(pluralizeRu(n, 'день', 'дня', 'дней')).toBe(expected);
  });
});

describe('deriveDisplayName', () => {
  it('returns a fallback for no email', () => {
    expect(deriveDisplayName(null)).toBe('Без имени');
  });

  it('capitalizes the local part of the email', () => {
    expect(deriveDisplayName('irin.markina@mail.ru')).toBe('Irin Markina');
  });

  it('handles a single-word local part', () => {
    expect(deriveDisplayName('plants@example.com')).toBe('Plants');
  });

  it('collapses repeated separators', () => {
    expect(deriveDisplayName('a..b__c@example.com')).toBe('A B C');
  });
});

describe('formatInterval', () => {
  it('special-cases 7/14/30 days', () => {
    expect(formatInterval(7)).toBe('Неделя');
    expect(formatInterval(14)).toBe('2 недели');
    expect(formatInterval(30)).toBe('Месяц');
  });

  it('falls back to a plural day count otherwise', () => {
    expect(formatInterval(3)).toBe('3 дня');
    expect(formatInterval(5)).toBe('5 дней');
  });
});
