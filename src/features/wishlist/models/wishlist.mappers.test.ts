import { describe, expect, it } from 'vitest';
import { mapWishlistRowToItem } from './wishlist.mappers';

describe('mapWishlistRowToItem', () => {
  it('maps a purchased row with an image', () => {
    const result = mapWishlistRowToItem({
      id: 'item-1',
      name: 'Монстера альбо',
      image_url: 'https://example.com/photo.jpg',
      is_purchased: true,
      created_at: '2026-01-01T00:00:00.000Z',
    });

    expect(result).toEqual({
      id: 'item-1',
      name: 'Монстера альбо',
      imageUrl: 'https://example.com/photo.jpg',
      isPurchased: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z').getTime(),
    });
  });

  it('maps a row without an image to a null imageUrl', () => {
    const result = mapWishlistRowToItem({
      id: 'item-2',
      name: 'Филодендрон Пинк Принцесс',
      image_url: null,
      is_purchased: false,
      created_at: '2026-01-02T00:00:00.000Z',
    });

    expect(result.imageUrl).toBeNull();
    expect(result.isPurchased).toBe(false);
  });
});
