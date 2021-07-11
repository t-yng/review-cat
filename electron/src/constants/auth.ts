export type OAuthOptions = {
  clientId: string;
  clientSecret: string;
  scopes: string[];
};

export const oAuthOptions = {
  clientId: process.env.GITHUB_APP_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
  scopes: ['repo:status'],
};
