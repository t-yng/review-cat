import { atom } from 'jotai';

const TOKEN_STORAGE_KEY = 'token';

export const tokenAtom = atom<string | null>(
  localStorage.getItem(TOKEN_STORAGE_KEY)
);

export const tokenAtomWithPersistence = atom<string | null, string>(
  (get) => get(tokenAtom),
  (get, set, newToken) => {
    set(tokenAtom, newToken);
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
  }
);

export const signInAtom = atom(null, async (get, set) => {
  const code = await window.ipc.loginWithGithub();
  const token = await window.ipc.getAccessToken(code);
  set(tokenAtomWithPersistence, token);
});
