import { MutationCache, QueryClient } from '@tanstack/react-query';
import { emitToast } from '../ui/toast/toastBus';

const MUTATION_ERROR_MESSAGE = 'Не удалось сохранить изменения. Проверьте соединение и попробуйте ещё раз.';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
  /**
   * Единая точка для ошибок всех мутаций в приложении — раньше упавшая мутация
   * просто ничего не делала (17 мест вида `void someAsyncCall()` без единого
   * catch/toast). Показываем общее сообщение вместо технического текста
   * Supabase-ошибки — оно не локализовано и не рассчитано на пользователя.
   */
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation failed:', error);
      emitToast(MUTATION_ERROR_MESSAGE);
    },
  }),
});
