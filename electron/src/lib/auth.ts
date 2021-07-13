import { BrowserWindow } from 'electron';
import { oAuthAccessToken } from '../api/github';
import { OAuthOptions } from '../constants/auth';

const handleGithubOAuthUrl = async (
  url: string
): Promise<{
  code: string | null;
  error: string | null;
}> => {
  const searchParams = new URL(url).searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  return {
    code,
    error,
  };
};

export const loginWithGithub = async (
  oAuthOptions: OAuthOptions
): Promise<string> => {
  const oAuthWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  const promise = new Promise<string>((resolve, reject) => {
    const handleCallback = async (url: string) => {
      const { code, error } = await handleGithubOAuthUrl(url);

      if (code) {
        resolve(code);
      } else if (error) {
        reject(new Error(error));
      }

      if (code || error) {
        oAuthWindow.destroy();
      }
    };

    oAuthWindow.webContents.on('will-navigate', function (event, url) {
      handleCallback(url);
    });

    oAuthWindow.webContents.on('will-redirect', function (event, url) {
      handleCallback(url);
    });
  });

  const session = oAuthWindow.webContents.session;
  session.clearStorageData();

  const oAuthUrl = `https://github.com/login/oauth/authorize?client_id=${oAuthOptions.clientId}&scope=${oAuthOptions.scopes}`;
  oAuthWindow.loadURL(oAuthUrl);
  oAuthWindow.show();

  return promise;
};

export const getGithubOAuthToken = async (
  oAuthOptions: OAuthOptions,
  code: string
): Promise<string | null> => {
  const credentials = {
    clientId: oAuthOptions.clientId,
    clientSecret: oAuthOptions.clientSecret,
    code: code,
  };
  const { access_token } = await oAuthAccessToken(credentials);
  return access_token;
};
