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

export const signInAtom = atom(null, async (get, set) => {
  const code = await window.ipc.loginWithGithub();
  const token = await window.ipc.getAccessToken(code);
  set(tokenAtomWithPersistence, token);
});
