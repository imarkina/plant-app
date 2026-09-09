import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const WishlistPage = () => {
  return (
    <div>
      <BackButton />
      <ComingSoon
        emoji="💚"
        title="Вишлист в разработке"
        description="Карусель «хочу купить», рекомендации по горшкам и подсказки по совместимости появятся здесь."
      />
    </div>
  );
};
