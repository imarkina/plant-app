import { Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { AuthForm, useAuthContext } from '../../features/auth';

export const AuthPage = () => {
  const { user, loading } = useAuthContext();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] rounded-4xl border border-surface-glass-border bg-surface-glass-strong p-8 shadow-elevated backdrop-blur-xl backdrop-saturate-150">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-brand opacity-30 blur-2xl" />
            <div className="flex size-20 items-center justify-center rounded-3xl bg-brand shadow-fab">
              <Leaf size={36} strokeWidth={2} className="text-lime-800" />
            </div>
          </div>
          <h1 className="text-h1 text-text-primary">Plant Parent OS</h1>
          <p className="mt-2 text-body text-text-muted">
            Войди, чтобы ухаживать за своими питомцами
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
};
