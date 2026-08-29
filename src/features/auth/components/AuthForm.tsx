import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/ui/components/Button/Button';
import { useAuthContext } from '../hooks/useAuthContext';
import { signInSchema, signUpSchema } from '../models/auth.schema';
import './AuthForm.css';

type Mode = 'signIn' | 'signUp';
type FieldName = 'email' | 'password' | 'confirmPassword';
type FieldErrors = Partial<Record<FieldName, string>>;
type LocationState = { from?: { pathname: string } };

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
    <div className="auth-form">
      <div className="auth-form__tabs">
        <button
          type="button"
          className={
            mode === 'signIn' ? 'auth-form__tab auth-form__tab--active' : 'auth-form__tab'
          }
          onClick={() => switchMode('signIn')}
        >
          Вход
        </button>
        <button
          type="button"
          className={
            mode === 'signUp' ? 'auth-form__tab auth-form__tab--active' : 'auth-form__tab'
          }
          onClick={() => switchMode('signUp')}
        >
          Регистрация
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label className="auth-form__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={submitting}
          />
          {fieldErrors.email && <span className="auth-form__error">{fieldErrors.email}</span>}
        </label>

        <label className="auth-form__field">
          <span>Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            disabled={submitting}
          />
          {fieldErrors.password && (
            <span className="auth-form__error">{fieldErrors.password}</span>
          )}
        </label>

        {mode === 'signUp' && (
          <label className="auth-form__field">
            <span>Повторите пароль</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              disabled={submitting}
            />
            {fieldErrors.confirmPassword && (
              <span className="auth-form__error">{fieldErrors.confirmPassword}</span>
            )}
          </label>
        )}

        {formError && (
          <div className="auth-form__banner auth-form__banner--error">{formError}</div>
        )}
        {infoMessage && (
          <div className="auth-form__banner auth-form__banner--info">{infoMessage}</div>
        )}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Подождите...' : mode === 'signIn' ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </form>
    </div>
  );
};
