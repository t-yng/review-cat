import { BrowserWindow, WebContents } from 'electron';
import { auth } from './';
import { oAuthOptions } from '../constants/auth';

describe('auth', () => {
  describe('loginWithGithub', () => {
    const loadUrlSpy = jest.spyOn(new BrowserWindow(), 'loadURL');

    beforeEach(() => {
      loadUrlSpy.mockReset();
    });

    it('GithubのOAuth認証画面を表示すること', () => {
      auth.loginWithGithub(oAuthOptions);
      expect(loadUrlSpy).toHaveBeenCalled();
      expect(loadUrlSpy).toHaveBeenCalledWith(
        `https://github.com/login/oauth/authorize?client_id=${oAuthOptions.clientId}&scope=${oAuthOptions.scopes}`
      );
    });

    it('認証後のリダイレクトURLから code を取得できること', async () => {
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
