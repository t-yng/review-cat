import { PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import { pullRequestMapper } from '../graphql/mapper';
import {
  SearchPullRequest,
  SearchPullRequestsQuery,
  SearchPullRequestViewer,
} from '../graphql/queries/SearchPullRequest';
import { SearchPullRequest$data } from '../graphql/queries/__generated__/SearchPullRequest.graphql';
import { SearchPullRequestsQuery as SearchPullRequestsQueryType } from '../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';
import { SearchPullRequestViewer$key } from '../graphql/queries/__generated__/SearchPullRequestViewer.graphql';
import { PullRequest } from '../models/PullRequest';

export const usePullRequests = (
  preloadedQuery: PreloadedQuery<SearchPullRequestsQueryType>
) => {
  const data = usePreloadedQuery<SearchPullRequestsQueryType>(
    SearchPullRequestsQuery,
    preloadedQuery
  );

  const searchPullRequests = useFragment(
    SearchPullRequest,
    data.search.nodes
  ) as Array<SearchPullRequest$data>;

  // TODO: ログイン時にログインユーザーの情報は取得してjotaiで管理して、参照する
  const viewer = useFragment<SearchPullRequestViewer$key>(
    SearchPullRequestViewer,
    data.viewer
  );

  const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) =>
    pullRequestMapper.toModelFromSearchPullRequest(pr, viewer)
  );

  return {
    pullRequests,
  };
};
