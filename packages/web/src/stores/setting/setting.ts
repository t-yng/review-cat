import { atom, AtomEffect } from 'recoil';
import { storage } from '@/lib';
import { Settings } from '@/models';

const defaultSetting: Settings = {
  notifyReviewRequested: false,
  showsRequestedReviewPR: true,
  showsInReviewPR: true,
  showsApprovedPR: true,
  showsMyPR: true,
  autoLaunched: false,
  subscribedRepositories: [],
};

const storageEffect: AtomEffect<Settings> = ({ setSelf, onSet }) => {
  const setting = storage.getSettings();

  if (setting) {
    setSelf((prev) => ({ ...prev, ...setting }));
  }

  onSet((newValue) => {
    storage.setSettings(newValue);
  });
};

export const settingState = atom<Settings>({
  key: 'settingState',
  default: defaultSetting,
  effects: [storageEffect],
});
