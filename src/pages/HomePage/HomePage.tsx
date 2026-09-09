import { Header } from '../../shared/ui/components/Header/Header';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const HomePage = () => {
  return (
    <>
      <Header title="Что растёт сегодня?" />
      <ComingSoon
        emoji="🏠"
        title="Дашборд в разработке"
        description="Растение дня, задачи на сегодня и быстрые действия появятся здесь. Пока загляни в «Коллекцию»."
      />
      <BottomNav />
    </>
  );
};
