import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { signInSchema, signUpSchema } from '../models/auth.schema';

type Mode = 'signIn' | 'signUp';
type FieldName = 'email' | 'password' | 'confirmPassword';
type FieldErrors = Partial<Record<FieldName, string>>;
type LocationState = { from?: { pathname: string } };

const TABS: { id: Mode; label: string }[] = [
  { id: 'signIn', label: 'Вход' },
  { id: 'signUp', label: 'Регистрация' },
];

export const AuthForm = () => {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/';

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setFieldErrors({});
    setFormError(null);
    setInfoMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    const schema = mode === 'signIn' ? signInSchema : signUpSchema;
    const result = schema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldName;

        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }

      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      if (mode === 'signIn') {
        await signIn(email, password);
        navigate(redirectTo, { replace: true });
      } else {
        await signUp(email, password);
        setInfoMessage('Проверьте почту и подтвердите email, чтобы завершить регистрацию.');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Что-то пошло не так.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-1 rounded-full bg-bg-tertiary p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchMode(tab.id)}
            className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-sans font-semibold transition-colors duration-100 ${
              mode === tab.id
                ? 'bg-bg-elevated text-text-primary shadow-card'
                : 'bg-transparent text-text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <label className="mb-4 flex flex-col gap-1.5">
          <span className="text-body-sm font-semibold text-text-secondary">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={submitting}
            className="rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3.5 text-body font-sans text-text-primary outline-none transition-shadow duration-100 focus:ring-2 focus:ring-brand-purple/40"
          />
          {fieldErrors.email && <span className="text-caption text-danger">{fieldErrors.email}</span>}
        </label>

        <label className="mb-4 flex flex-col gap-1.5">
          <span className="text-body-sm font-semibold text-text-secondary">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            disabled={submitting}
            className="rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3.5 text-body font-sans text-text-primary outline-none transition-shadow duration-100 focus:ring-2 focus:ring-brand-purple/40"
          />
          {fieldErrors.password && (
            <span className="text-caption text-danger">{fieldErrors.password}</span>
          )}
        </label>

        {mode === 'signUp' && (
          <label className="mb-4 flex flex-col gap-1.5">
            <span className="text-body-sm font-semibold text-text-secondary">Повторите пароль</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              disabled={submitting}
              className="rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3.5 text-body font-sans text-text-primary outline-none transition-shadow duration-100 focus:ring-2 focus:ring-brand-purple/40"
            />
            {fieldErrors.confirmPassword && (
              <span className="text-caption text-danger">{fieldErrors.confirmPassword}</span>
            )}
          </label>
        )}

        {formError && (
          <div className="mb-4 rounded-2xl bg-danger-soft px-4 py-3 text-body-sm text-danger">
            {formError}
          </div>
        )}
        {infoMessage && (
          <div className="mb-4 rounded-2xl bg-accent-glow px-4 py-3 text-body-sm text-accent">
            {infoMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-2xl bg-brand px-5 py-3.5 text-button font-sans text-white shadow-fab transition-all duration-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {submitting ? 'Подождите...' : mode === 'signIn' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};
