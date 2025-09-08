import { storage } from '@/lib';
import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom, userInitializedAtom } from './atom';
import { fetchUser } from './request';
import { useToken } from './useToken';

export const useAuth = () => {
  const { token, setToken, removeToken } = useToken();
  const [user, setUser] = useRecoilState(userAtom);
  const [userInitialized, setUserInitialized] =
    useRecoilState(userInitializedAtom);
  const [loading, setLoading] = useState(false);

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
    [setUser, removeToken]
  );

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
        setUserInitialized(true);
      }
    }
  }, [token, setUser, setLoading, signOut, setUserInitialized]);

  return { user, signIn, signOut, autoSignIn, loading, userInitialized };
};
