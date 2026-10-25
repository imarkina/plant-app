import { Header } from '../../shared/ui/components/Header/Header';
import { Skeleton } from '../../shared/ui/components/Skeleton/Skeleton';
import { WishlistForm, WishlistList, useWishlist } from '../../features/wishlist';

export const WishlistPage = () => {
  const { loading } = useWishlist();

  if (loading) {
    return (
      <>
        <Header title="Вишлист" />
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Вишлист" />
      <WishlistList />
      <h2 className="mt-8 mb-4 text-h3 desktop:text-h3-lg text-text-primary">Добавить растение</h2>
      <WishlistForm />
    </>
  );
};
