export const buildSearchPullRequestsQuery = (repositories: string[]) => `
type:pr state:open involves:@me -author:@me ${repositories
  .map((repo) => `repo:${repo}`)
  .join(' ')}
`;
