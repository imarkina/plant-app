import { useEffect, useState } from 'react';
import { subscribeToast } from '../../toast/toastBus';
import { Toast } from '../Toast/Toast';

const TOAST_DURATION_MS = 3000;

/** Слушает toastBus и рендерит тосты, которые прилетают вне React-дерева (сейчас — ошибки мутаций из queryClient). */
export const GlobalToast = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsubscribe = subscribeToast((text) => {
      clearTimeout(timer);
      setMessage(text);
      timer = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return <Toast message={message} />;
};
