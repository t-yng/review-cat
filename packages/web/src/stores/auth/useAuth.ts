import { storage } from '@/lib';
import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggedInSelector, loginUserState, tokenState } from './auth';
import { fetchUser } from './effect';

export const useAuth = () => {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const setToken = useSetRecoilState(tokenState);
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const signIn = useCallback(
    async (callback: () => void) => {
      const code = await window.ipc.loginWithGithub();
      const token = await window.ipc.getAccessToken(code);
      // FIXME: 処理が漏れているので、後でリファクタする
      setToken(token);
      storage.setGithubAccessToken(token);
      const user = await fetchUser();
      setLoginUser(user);
      if (callback != null) {
        callback();
      }
    },
    [setLoginUser, setToken]
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
