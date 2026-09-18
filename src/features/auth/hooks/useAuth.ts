import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../../shared/supabase/client';
import type { AuthUser } from '../models/auth.types';
import { toFriendlyAuthMessage } from '../models/auth.errors';

function toAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user) {
    return null;
  }

  return { id: user.id, email: user.email ?? null, createdAt: user.created_at ?? null };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(toAuthUser(data.session?.user));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(toFriendlyAuthMessage(error));
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw new Error(toFriendlyAuthMessage(error));
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(toFriendlyAuthMessage(error));
    }
  };

  return { user, loading, signIn, signUp, signOut };
}
