import { supabase } from '../../../shared/supabase/client';
import { unwrap } from '../../../shared/supabase/unwrap';
import type { NewWishlistItemInput, WishlistItem, WishlistRepository } from './wishlist.types';
import { mapWishlistRowToItem } from './wishlist.mappers';

const WISHLIST_TABLE = 'wishlist';

class SupabaseWishlistRepository implements WishlistRepository {
  async getAll(): Promise<WishlistItem[]> {
    const rows = unwrap(
      await supabase.from(WISHLIST_TABLE).select('*').order('created_at', { ascending: false }),
    );

    return rows.map(mapWishlistRowToItem);
  }

  async create(input: NewWishlistItemInput): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from(WISHLIST_TABLE)
      .insert({ name: input.name, image_url: input.imageUrl ?? null })
      .select('id, name, image_url, is_purchased, created_at')
      .single();

    if (error) {
      throw error;
    }

    return mapWishlistRowToItem(data);
  }

  async setPurchased(itemId: string, isPurchased: boolean): Promise<void> {
    unwrap(
      await supabase.from(WISHLIST_TABLE).update({ is_purchased: isPurchased }).eq('id', itemId),
    );
  }
}

export const wishlistRepository = new SupabaseWishlistRepository();
