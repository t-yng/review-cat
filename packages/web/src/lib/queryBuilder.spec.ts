import { buildSearchPullRequestsQuery } from './queryBuilder';

describe('queryBuilder', () => {
  describe('buildSearchPullRequestsQuery', () => {
    it('リポジトリの一覧を含めた検索クエリが生成されること', () => {
      const repositories = ['test/repositoryA', 'test/repositoryB'];
      const result = buildSearchPullRequestsQuery(repositories);
      expect(result).toEqual(expect.stringContaining('repo:test/repositoryA'));
      expect(result).toEqual(expect.stringContaining('repo:test/repositoryB'));
    });

    it('リポジトリの一覧が空配列の時は空文字を返す', () => {
      const repositories: string[] = [];
      const result = buildSearchPullRequestsQuery(repositories);
      expect(result).toBe('');
    });
  });
});
