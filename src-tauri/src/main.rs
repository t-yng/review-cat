#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod api;
mod oauth;

use std::path::PathBuf;
use std::env;

use tauri::{Manager, SystemTray, SystemTrayEvent};
use regex::Regex;
use auto_launch::AutoLaunch;
use dotenv::dotenv;

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

#[tauri::command]
fn update_auto_launch(app_handle: tauri::AppHandle, auto_launched: bool) {
  let package_info = app_handle.package_info();
  let app_name = match env::var("APP_ENV") {
    Ok(app_env) => {
      if app_env == "development" { "app" } else { &package_info.name }
    }
    Err(err) => {
      println!("failed load APP_ENV: {}", err);
      &package_info.name
    }
  };

  let mut path_buf = PathBuf::from(app_handle.path_resolver().resource_dir().unwrap());
  path_buf.push(&app_name);
  let app_path = path_buf.to_str().unwrap();

  let auto = AutoLaunch::new(app_name, app_path, false, true);

  // TODO: 例外処理をちゃんと書く
  let result = match auto_launched {
    true => { auto.enable() }
    false => { auto.disable() }
  };

  match result {
    Ok(()) => {}
    Err(err) => {
      println!("failed update auto launch: {}", err);
    }
  }
}

fn get_code_from_callback_url(url: &str) -> String {
  let re = Regex::new(r"code=(.*)&?").unwrap();
  let caps = re.captures(url).unwrap();
  // TODO: 戻り値をOptionにする。結果をチェックする
  caps[1].into()
}

fn toggle_window_visible(window: &tauri::Window) {
  match window.is_visible() {
    Ok(visible) => {
      if visible {
        window.hide().unwrap();
      } else {
        window.show().unwrap();
      }
    }
    Err(err) => {
      panic!("failed toggle visible for main window {}", err);
    }
  }
}

fn main() {
  dotenv().ok();

  let system_tray = SystemTray::new();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      login_with_github,
      close_oauth_window,
      get_github_access_token,
      update_auto_launch,
    ])
    .on_page_load(|window, payload| {
      let url = payload.url();
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
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position,
        ..
      } => {
        let window = app.get_window("main-window").unwrap();
        let i32_position = tauri::PhysicalPosition::<i32> {
          x: position.x as i32,
          y: position.y as i32,
        };
        window.set_position(tauri::Position::Physical(i32_position)).unwrap();
        toggle_window_visible(&window);
      }
      _ => {}
    })
    .system_tray(system_tray)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
