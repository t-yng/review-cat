import { storage } from '@/lib';
import { User } from '@/models';
import { useCallback, useState } from 'react';
import { fetchUser } from './request';
import { useToken } from './useToken';

export const useAuth = () => {
  const { token, setToken, removeToken } = useToken();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const autoSignIn = useCallback(async () => {
    setLoading(true);

    if (!token) {
      setLoading(false);
      return;
    }

    if (token) {
      try {
        const user = await fetchUser();
        setUser(user);
      } catch (error) {
        console.error(error);
        signOut();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const signIn = useCallback(
    async (callback: () => void) => {
      const code = await window.ipc.loginWithGithub();
      const token = await window.ipc.getAccessToken(code);
      setToken(token);

      const user = await fetchUser();
      setUser(user);

      if (callback != null) {
        callback();
      }
    },
    [setUser, setToken]
  );

  const signOut = useCallback(
    (callback?: () => void) => {
      removeToken();
      setUser(null);
      storage.removeSettings();

      if (callback != null) {
        callback();
      }
    },
    [setUser, setToken]
  );

  return { user, signIn, signOut, autoSignIn, loading };
};
