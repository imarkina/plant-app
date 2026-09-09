import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const AddPlantPage = () => {
  return (
    <div>
      <BackButton />
      <ComingSoon
        emoji="➕"
        title="Пошаговое добавление в разработке"
        description="Сфоткать → идентификация → форма параметров растения одним потоком появится здесь. Пока добавить растение можно через кнопку загрузки в «Коллекции»."
      />
    </div>
  );
};
