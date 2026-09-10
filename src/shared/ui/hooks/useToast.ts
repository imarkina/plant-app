import { useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  return { message, showToast };
}
