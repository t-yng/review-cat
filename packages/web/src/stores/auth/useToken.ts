import { storage } from '@/lib';
import { useCallback, useState } from 'react';

export const useToken = () => {
  const [token, _setToken] = useState<string | null>(
    storage.getGithubAccessToken()
  );

  const setToken = useCallback((token: string) => {
    _setToken(token);
    storage.setGithubAccessToken(token);
  }, []);

  const removeToken = useCallback(() => {
    _setToken(null);
    storage.removeGitHubAccessToken();
  }, []);

  return {
    token,
    setToken,
    removeToken,
  };
};
