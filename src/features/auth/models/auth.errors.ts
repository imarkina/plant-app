import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js';

const messagesByCode: Record<string, string> = {
  invalid_credentials: 'Неверный email или пароль.',
  email_not_confirmed: 'Email не подтверждён. Проверьте почту и перейдите по ссылке из письма.',
  user_already_exists: 'Пользователь с таким email уже зарегистрирован.',
  email_exists: 'Пользователь с таким email уже зарегистрирован.',
  weak_password: 'Пароль слишком простой. Используйте не менее 8 символов.',
  email_address_invalid: 'Некорректный email.',
  over_request_rate_limit: 'Слишком много попыток. Подождите немного и попробуйте снова.',
  over_email_send_rate_limit: 'Слишком много попыток. Подождите немного и попробуйте снова.',
  user_banned: 'Доступ заблокирован. Обратитесь в поддержку.',
  signup_disabled: 'Регистрация временно недоступна.',
};

export function toFriendlyAuthMessage(error: unknown): string {
  if (error instanceof AuthRetryableFetchError) {
    return 'Проблема с сетью. Проверьте подключение и попробуйте снова.';
  }

  if (error instanceof AuthApiError) {
    return (error.code && messagesByCode[error.code]) || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Что-то пошло не так. Попробуйте ещё раз.';
}
