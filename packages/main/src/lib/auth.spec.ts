import { BrowserWindow, WebContents } from 'electron';
import { auth } from '.';
import { oAuthOptions } from '../constants/auth';

describe('auth', () => {
  describe('loginWithGithub', () => {
    const loadUrlSpy = jest.spyOn(new BrowserWindow(), 'loadURL');

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
      jest
        .spyOn<WebContents, any>(new BrowserWindow().webContents, 'on')
        .mockImplementation((event, callback: any) => {
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
