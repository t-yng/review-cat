export const buildSearchPullRequestsQuery = (repositories: string[]) => {
  if (repositories.length === 0) {
    return '';
  } else {
    return `type:pr state:open involves:@me -author:@me ${repositories
      .map((repo) => `repo:${repo}`)
      .join(' ')}
    `;
  }
};
