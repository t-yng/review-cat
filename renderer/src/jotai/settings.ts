import { atomWithReducer } from 'jotai/utils';
import { storage } from '../lib/storage';
import { Settings } from '../models';

export const UPDATE_ACTION = 'update' as const;

type UpdateAction = {
  type: typeof UPDATE_ACTION;
  payload: Partial<Settings>;
};

type SettingsAction = UpdateAction;

const defaultSettings: Settings = {
  notifyReviewRequested: false,
  showsRequestedReviewPR: true,
  showsInReviewPR: true,
  showsApprovedPR: true,
  subscribedPRList: [],
};

const initialSettings = storage.getSettings() ?? defaultSettings;

const settingsReducer = (prev: Settings, action: SettingsAction) => {
  switch (action.type) {
    case UPDATE_ACTION: {
      const newSettings: Settings = {
        ...prev,
        ...action.payload,
      };
      storage.setSettings(newSettings);
      return newSettings;
    }
  }
};

export const settingsReducerAtom = atomWithReducer(
  initialSettings,
  settingsReducer
);
