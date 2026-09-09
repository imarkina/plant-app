import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';

export const DiagnosisPage = () => {
  return (
    <div>
      <BackButton />
      <ComingSoon
        emoji="🩺"
        title="Диагноз-чат в разработке"
        description="История диалогов с Gemini по всем растениям, загрузка фото и чат появятся здесь."
      />
    </div>
  );
};
