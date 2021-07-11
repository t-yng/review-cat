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
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          code: credentials.code,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (response.ok) {
      return (await response.json()) as OAuthResponse;
    } else {
      throw new Error(await response.text());
      // console.log(await response.text());
      // return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
