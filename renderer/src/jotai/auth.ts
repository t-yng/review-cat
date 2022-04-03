import { atom } from 'jotai';
import { once } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { storage } from '../lib/storage';

export const tokenAtom = atom<string | null>(storage.getGithubAccessToken());

export const isLoggedInAtom = atom((get) => {
  const token = get(tokenAtom);
  return token != null && token !== '';
});

export const tokenAtomWithPersistence = atom<string | null, string>(
  (get) => get(tokenAtom),
  (get, set, newToken) => {
    set(tokenAtom, newToken);
    storage.setGithubAccessToken(newToken);
  }
);

export const signInAtom = atom<null, (() => void) | undefined>(
  null,
  (get, set, callback) => {
    once('github-oauth-code', async (event) => {
      // NOTE: すぐに認証ウィンドウを閉じるとアプリがクラッシュするので一定時間後にウィンドウを閉じる
      setTimeout(() => {
        invoke('close_oauth_window');
      }, 1000);

      const code = event.payload;
      const token = await invoke<string>('get_github_access_token', { code });
      alert(token);
      set(tokenAtomWithPersistence, token);
      if (callback != null) {
        callback();
      }
    });
    invoke('login_with_github');
  }
);

export const signOutAtom = atom<null, () => void | undefined>(
  null,
  (_, set, callback) => {
    set(tokenAtom, null);
    storage.removeGitHubAccessToken();
    storage.removeSettings();
    if (callback != null) {
      callback();
    }
  }
);
