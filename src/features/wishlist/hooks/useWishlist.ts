import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NewWishlistItemInput, WishlistItem } from '../models/wishlist.types';
import { wishlistRepository } from '../models/wishlist.repository';

export const wishlistQueryKey = ['wishlist'] as const;

export function useWishlist() {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: wishlistQueryKey,
    queryFn: () => wishlistRepository.getAll(),
  });

  const items = wishlistQuery.data ?? [];

  const patchItems = (updater: (items: WishlistItem[]) => WishlistItem[]) => {
    queryClient.setQueryData<WishlistItem[]>(wishlistQueryKey, (current) => updater(current ?? []));
  };

  const createMutation = useMutation({
    mutationFn: (input: NewWishlistItemInput) => wishlistRepository.create(input),
    onSuccess: (item) => {
      patchItems((current) => [item, ...current]);
    },
  });

  const setPurchasedMutation = useMutation({
    mutationFn: ({ itemId, isPurchased }: { itemId: string; isPurchased: boolean }) =>
      wishlistRepository.setPurchased(itemId, isPurchased),
    onSuccess: (_, { itemId, isPurchased }) => {
      patchItems((current) =>
        current.map((item) => (item.id === itemId ? { ...item, isPurchased } : item)),
      );
    },
  });

  return {
    items,
    loading: wishlistQuery.isPending,
    createItem: (input: NewWishlistItemInput) => createMutation.mutateAsync(input).then(() => undefined),
    setPurchased: (itemId: string, isPurchased: boolean) =>
      setPurchasedMutation.mutateAsync({ itemId, isPurchased }).then(() => undefined),
  };
}
