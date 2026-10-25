export interface WishlistItem {
  id: string;
  name: string;
  imageUrl: string | null;
  isPurchased: boolean;
  createdAt: number;
}

export interface NewWishlistItemInput {
  name: string;
  imageUrl?: string | null;
}

export interface WishlistRepository {
  getAll(): Promise<WishlistItem[]>;
  create(input: NewWishlistItemInput): Promise<WishlistItem>;
  setPurchased(itemId: string, isPurchased: boolean): Promise<void>;
}
