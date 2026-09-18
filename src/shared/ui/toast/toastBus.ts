/**
 * Простая pub-sub шина для тостов, которые нужно показать вне React-дерева —
 * например, из queryClient.mutationCache (модульный синглтон, создаётся до
 * рендера приложения и не имеет доступа к контексту/состоянию компонентов).
 */
type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function emitToast(message: string) {
  listeners.forEach((listener) => listener(message));
}

export function subscribeToast(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
