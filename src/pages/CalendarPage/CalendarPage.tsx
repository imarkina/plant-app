import { Header } from '../../shared/ui/components/Header/Header';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const CalendarPage = () => {
  return (
    <>
      <Header title="Календарь" />
      <ComingSoon
        emoji="🗓"
        title="Календарь в разработке"
        description="Месячный вид с событиями по каждому растению — покупка, полив, фото — появится здесь."
      />
      <BottomNav />
    </>
  );
};
