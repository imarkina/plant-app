import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
