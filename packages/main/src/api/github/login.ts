import axios from 'axios';

type Credentials = {
  clientId: string;
  clientSecret: string;
  code: string;
};

type OAuthResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

export const oAuthAccessToken = async (
  credentials: Credentials
): Promise<OAuthResponse> => {
  try {
    const res = await axios.post<OAuthResponse>(
      'https://github.com/login/oauth/access_token',
      {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: credentials.code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(res.statusText);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
