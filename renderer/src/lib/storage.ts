import { Settings } from '../models';

const GITHUB_ACCESS_TOKEN_KEY = 'gh_atk';
const SETTINGS_KEY = 'settings';

const getGithubAccessToken = () =>
  localStorage.getItem(GITHUB_ACCESS_TOKEN_KEY);

const setGithubAccessToken = (token: string) =>
  localStorage.setItem(GITHUB_ACCESS_TOKEN_KEY, token);

const getSettings = (): Settings | null => {
  const settingsJson = localStorage.getItem(SETTINGS_KEY);
  if (settingsJson == null) {
    return null;
  } else {
    return JSON.parse(settingsJson);
  }
};

const setSettings = (settings: Settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const storage = {
  getGithubAccessToken,
  setGithubAccessToken,
  getSettings,
  setSettings,
};
