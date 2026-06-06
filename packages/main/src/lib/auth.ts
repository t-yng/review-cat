import { shell } from 'electron';
import { oAuthAccessToken } from '../api/github';
import { OAuthOptions } from '../constants/auth';

let pendingResolve: ((code: string) => void) | null = null;
let pendingReject: ((err: Error) => void) | null = null;

const parseOAuthUrl = (
  url: string
): {
  code: string | null;
  error: string | null;
} => {
  const searchParams = new URL(url).searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  return {
    code,
    error,
  };
};

export const loginWithGithub = (
  oAuthOptions: OAuthOptions
): Promise<string> => {
  const oAuthUrl = `https://github.com/login/oauth/authorize?client_id=${oAuthOptions.clientId}&scope=${oAuthOptions.scopes}`;
  shell.openExternal(oAuthUrl);

  return new Promise<string>((resolve, reject) => {
    pendingResolve = resolve;
    pendingReject = reject;
  });
};

export const handleOAuthCallback = (url: string): void => {
  const { code, error } = parseOAuthUrl(url);

  if (code && pendingResolve) {
    pendingResolve(code);
  } else if (error && pendingReject) {
    pendingReject(new Error(error));
  }

  pendingResolve = null;
  pendingReject = null;
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
