import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const AlbumPage = () => {
  return (
    <div>
      <BackButton />
      <ComingSoon
        emoji="📸"
        title="Альбом в разработке"
        description="Таймлайн фото по растению, сравнение до/после и общая галерея появятся здесь."
      />
    </div>
  );
};
