import { describe, it, expect } from 'vitest';
import { buildSearchPullRequestsQuery } from './queryBuilder';

describe('queryBuilder', () => {
  describe('buildSearchPullRequestsQuery', () => {
    it('A search query including the repository list is generated', () => {
      const repositories = ['test/repositoryA', 'test/repositoryB'];
      const result = buildSearchPullRequestsQuery(repositories);
      expect(result).toEqual(expect.stringContaining('repo:test/repositoryA'));
      expect(result).toEqual(expect.stringContaining('repo:test/repositoryB'));
    });

    it('Returns an empty string when the repository list is an empty array', () => {
      const repositories: string[] = [];
      const result = buildSearchPullRequestsQuery(repositories);
      expect(result).toBe('');
    });
  });
});
