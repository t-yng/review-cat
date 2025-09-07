import { atom } from 'recoil';
import { User } from '@/models';

export const userAtom = atom<User | null>({
  key: 'userAtom',
  default: null,
});

export const userInitializedAtom = atom<boolean>({
  key: 'userInitializedAtom',
  default: false,
});
