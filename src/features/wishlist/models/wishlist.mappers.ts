import type { WishlistItem } from './wishlist.types';

interface SupabaseWishlistRow {
  id: string;
  name: string;
  image_url: string | null;
  is_purchased: boolean;
  created_at: string;
}

export function mapWishlistRowToItem(row: SupabaseWishlistRow): WishlistItem {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    isPurchased: row.is_purchased,
    createdAt: new Date(row.created_at).getTime(),
  };
}
