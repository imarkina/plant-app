/**
 * Простая pub-sub шина для тостов, которые нужно показать вне React-дерева —
 * например, из queryClient.mutationCache (модульный синглтон, создаётся до
 * рендера приложения и не имеет доступа к контексту/состоянию компонентов).
 */
export type ToastType = 'success' | 'error';

type Listener = (message: string, type: ToastType) => void;

const listeners = new Set<Listener>();

export function emitToast(message: string, type: ToastType = 'error') {
  listeners.forEach((listener) => listener(message, type));
}

export function subscribeToast(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
