use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Credentials {
  pub client_id: String,
  pub client_secret: String,
  pub code: String
}

#[derive(Deserialize, Debug)]
struct OAuthResponse {
  access_token: String,
}

#[tokio::main]
pub async fn get_oauth_access_token(credentials: Credentials) -> Result<String, reqwest::Error> {
  let client = reqwest::Client::new();
  let body = Credentials {
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    code: credentials.code,
  };

  let resp = client.post("https://github.com/login/oauth/access_token")
    .header("Content-Type", "application/json")
    .header("Accept", "application/json")
    .json(&body)
    .send().await?;

  let oauth: OAuthResponse = resp.json().await?;

  Ok(oauth.access_token)
}
