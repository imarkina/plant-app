import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * componentDidCatch ловит ошибки только в рендере/жизненном цикле дочерних компонентов —
 * не в асинхронных обработчиках (для них есть queryClient.mutationCache.onError, см. queryClient.ts).
 * Без этой границы любая необработанная ошибка рендера гасила всё приложение белым экраном.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl border border-surface-glass-border bg-surface-glass text-3xl shadow-card backdrop-blur-xl backdrop-saturate-150">
            😵
          </div>
          <h2 className="mt-4 text-h2 text-text-primary">Что-то пошло не так</h2>
          <p className="mt-2 max-w-xs text-body-sm text-text-muted">
            Приложение столкнулось с ошибкой. Попробуйте перезагрузить страницу.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer rounded-full bg-brand px-5 py-2.5 text-button font-sans font-semibold text-white"
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
