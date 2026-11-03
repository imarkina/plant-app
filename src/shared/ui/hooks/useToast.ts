import { useState } from 'react';
import type { ToastType } from '../toast/toastBus';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('success');

  const showToast = (text: string, toastType: ToastType = 'success') => {
    setMessage(text);
    setType(toastType);
    setTimeout(() => setMessage(null), 2500);
  };

  return { message, type, showToast };
}
