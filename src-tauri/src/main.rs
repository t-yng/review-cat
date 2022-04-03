#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod api;
mod oauth;

use tauri::Manager;
use regex::Regex;
use api::github::*;

#[tauri::command]
fn login_with_github(app_handle: tauri::AppHandle) {
  let options = oauth::oauth_options();
  let url = format!("https://github.com/login/oauth/authorize?client_id={}&scope={}", options.client_id, options.scopes);

  // TODO: パターンマッチでResult型を処理してエラー時にfalseを返すようにする
  tauri::window::WindowBuilder::new(
    &app_handle,
    "oauth-window",
    tauri::WindowUrl::App(url.into())
  ).build().unwrap();
}

#[tauri::command]
fn get_github_access_token(code: String) -> Result<String, String> {
  println!("get_access_token, code={}", code);

  let options = oauth::oauth_options();
  let credentials = Credentials {
    client_id: options.client_id,
    client_secret: options.client_secret,
    code: code,
  };

  let result = get_oauth_access_token(credentials);
  match result {
    Ok(token) => {
      Ok(token)
    },
    Err(_) => {Err("エラー".into())}
  }
}

#[tauri::command]
fn close_oauth_window(app_handle: tauri::AppHandle) {
  let window = app_handle.get_window("oauth-window").unwrap();
  window.close().unwrap();
}

fn get_code_from_callback_url(url: &str) -> String {
  let re = Regex::new(r"code=(.*)&?").unwrap();
  let caps = re.captures(url).unwrap();
  // TODO: 戻り値をOptionにする。結果をチェックする
  caps[1].into()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![login_with_github, close_oauth_window, get_github_access_token])
    .on_page_load(|window, payload| {
      let url = payload.url();
      println!("url: {}", url);
      if url.contains("?code=") {
        let code = get_code_from_callback_url(url);
        println!("code: {}", code);
        window.emit_to("main-window", "github-oauth-code", code).unwrap();
        // NOTE: イベント送信後にウィンドウを閉じるとアプリがクラッシュする。
        //       ウィンドウを非表示にしてフロントエンド側で一定時間後にウィンドウをクローズすることで回避
        //       原因は不明だがイベント処理が完了してない状態でウィンドウをクローズする処理を呼んでるから？
        // @see: https://docs.rs/tauri/1.0.0-rc.4/tauri/window/struct.Window.html#method.close
        window.hide().unwrap();
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
