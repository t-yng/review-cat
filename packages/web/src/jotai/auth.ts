import { atom } from 'jotai';
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
  async (get, set, callback) => {
    const code = await window.ipc.loginWithGithub();
    const token = await window.ipc.getAccessToken(code);
    set(tokenAtomWithPersistence, token);
    if (callback != null) {
      callback();
    }
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
