import { storage } from '@/lib';
import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggedInSelector, loginUserState, tokenState } from './auth';

export const useAuth = () => {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const setToken = useSetRecoilState(tokenState);
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const signIn = useCallback(
    async (callback: () => void) => {
      const code = await window.ipc.loginWithGithub();
      const token = await window.ipc.getAccessToken(code);
      setToken(token);
      if (callback != null) {
        callback();
      }
    },
    [setToken]
  );

  const signOut = useCallback(
    (callback: () => void) => {
      setToken(null);
      setLoginUser(null);
      storage.removeGitHubAccessToken();
      storage.removeSettings();
      if (callback != null) {
        callback();
      }
    },
    [setLoginUser, setToken]
  );

  return { loginUser, isLoggedIn, signIn, signOut };
};
