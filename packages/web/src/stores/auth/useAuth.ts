import { storage } from '@/lib';
import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom, userInitializedAtom } from './atom';
import { fetchUser } from './request';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    storage.getGithubAccessToken()
  );
  const [user, setUser] = useRecoilState(userAtom);
  const [userInitialized, setUserInitialized] =
    useRecoilState(userInitializedAtom);

  const persistToken = useCallback((token: string) => {
    setToken(token);
    storage.setGithubAccessToken(token);
  }, []);

  const removeToken = useCallback(() => {
    setToken(null);
    storage.removeGitHubAccessToken();
  }, []);

  const signIn = useCallback(
    async (callback: () => void) => {
      const code = await window.ipc.loginWithGithub();
      const token = await window.ipc.getAccessToken(code);
      persistToken(token);

      const user = await fetchUser();
      setUser(user);

      if (callback != null) {
        callback();
      }
    },
    [setUser, persistToken]
  );

  const signOut = useCallback(
    (callback?: () => void) => {
      removeToken();
      setUser(null);

      if (callback != null) {
        callback();
      }
    },
    [setUser, removeToken]
  );

  const autoSignIn = useCallback(async () => {
    if (token) {
      try {
        const user = await fetchUser();
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        signOut();
      } finally {
        setUserInitialized(true);
      }
    } else {
      setUserInitialized(true);
      return;
    }
  }, [token, setUser, signOut, setUserInitialized]);

  return { user, signIn, signOut, autoSignIn, userInitialized };
};
