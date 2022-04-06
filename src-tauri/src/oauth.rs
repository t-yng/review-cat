use std::env;

#[derive(Debug)]
pub struct OAuthOptions {
  pub client_id: String,
  pub client_secret: String,
  pub scopes: String,
}

pub fn oauth_options() -> OAuthOptions {
  OAuthOptions {
    client_id: env::var("GITHUB_APP_CLIENT_ID").unwrap(),
    client_secret: env::var("GITHUB_APP_CLIENT_SECRET").unwrap(),
    scopes: "repo,read:org".into(),
  }
}
