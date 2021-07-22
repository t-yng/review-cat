const GITHUB_ACCESS_TOKEN_KEY = 'gh_atk';

const getGithubAccessToken = () =>
  localStorage.getItem(GITHUB_ACCESS_TOKEN_KEY);

const setGithubAccessToken = (token: string) =>
  localStorage.setItem(GITHUB_ACCESS_TOKEN_KEY, token);

export const storage = {
  getGithubAccessToken,
  setGithubAccessToken,
};
