import { Leaf } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AuthForm, useAuthContext } from '../../features/auth';
import './AuthPage.css';

export const AuthPage = () => {
  const { user, loading } = useAuthContext();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <Leaf />
        <span>Plant Care</span>
      </div>
      <AuthForm />
    </div>
  );
};
