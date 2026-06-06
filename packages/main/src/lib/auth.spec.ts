import { vi, describe, it, expect, beforeEach } from 'vitest';
import { shell } from 'electron';
import { auth } from '.';
import { oAuthOptions } from '../constants/auth';

describe('auth', () => {
  describe('loginWithGithub', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('Opens GitHub OAuth URL in the default browser', () => {
      const openExternalSpy = vi
        .spyOn(shell, 'openExternal')
        .mockResolvedValue(undefined);

      auth.loginWithGithub(oAuthOptions);

      expect(openExternalSpy).toHaveBeenCalledWith(
        `https://github.com/login/oauth/authorize?client_id=${oAuthOptions.clientId}&scope=${oAuthOptions.scopes}`
      );
    });
  });

  describe('handleOAuthCallback', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('Resolves the pending promise with the code from the callback URL', async () => {
      const code = '123456';
      const promise = auth.loginWithGithub(oAuthOptions);

      auth.handleOAuthCallback(`review-cat://auth/callback?code=${code}`);

      await expect(promise).resolves.toBe(code);
    });

    it('Rejects the pending promise with an error from the callback URL', async () => {
      const promise = auth.loginWithGithub(oAuthOptions);

      auth.handleOAuthCallback(
        'review-cat://auth/callback?error=access_denied'
      );

      await expect(promise).rejects.toThrow('access_denied');
    });
  });
});
