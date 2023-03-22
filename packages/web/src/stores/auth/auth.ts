import { atom, AtomEffect, selector } from 'recoil';
import { storage } from '@/lib';
import { User } from '@/models';
import { autoSignInEffect } from './effect';

export const loginUserState = atom<User | null>({
  key: 'loginUserState',
  default: null,
  effects: [autoSignInEffect],
});

const persistTokenEffect: AtomEffect<string | null> = ({ setSelf, onSet }) => {
  const token = storage.getGithubAccessToken();
  setSelf(token);

  onSet((token) => {
    if (token != null && token !== '') {
      storage.setGithubAccessToken(token);
    }
  });
};

export const tokenState = atom<string | null>({
  key: 'tokenState',
  default: null,
  effects: [persistTokenEffect],
});

export const isLoggedInSelector = selector({
  key: 'isLoggedInSelector',
  get: ({ get }) => {
    const token = get(tokenState);
    return token != null && token !== '';
  },
});
