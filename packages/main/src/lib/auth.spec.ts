import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserWindow, WebContents } from 'electron';
import { auth } from '.';
import { oAuthOptions } from '../constants/auth';

describe('auth', () => {
  describe('loginWithGithub', () => {
    const loadUrlSpy = vi.spyOn(new BrowserWindow(), 'loadURL');

    beforeEach(() => {
      loadUrlSpy.mockReset();
    });

    it('Displays the GitHub OAuth authentication screen', () => {
      auth.loginWithGithub(oAuthOptions);
      expect(loadUrlSpy).toHaveBeenCalled();
      expect(loadUrlSpy).toHaveBeenCalledWith(
        `https://github.com/login/oauth/authorize?client_id=${oAuthOptions.clientId}&scope=${oAuthOptions.scopes}`
      );
    });

    it('Can retrieve the code from the redirect URL after authentication', async () => {
      const code = '123456';
      vi.spyOn<WebContents, 'on'>(new BrowserWindow().webContents, 'on')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation((event: any, callback: any): any => {
          if (event === 'will-redirect') {
            const event = new Event('will-redirect');
            callback(event, `https://github.com/?code=${code}`);
          }
        });
      const result = await auth.loginWithGithub(oAuthOptions);
      expect(result).toBe(code);
    });
  });
});
