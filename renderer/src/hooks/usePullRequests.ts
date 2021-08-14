import { useAtom } from 'jotai';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { pullRequestMapper, foo } from '../graphql/mapper';
import {
  SearchPullRequest,
  SearchPullRequestsQuery,
} from '../graphql/queries/SearchPullRequestsQuery';
import { SearchPullRequestsQuery as SearchPullRequestsQueryType } from '../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';
import { userAtom } from '../jotai/user';
import { PullRequest } from '../models/PullRequest';
import { User } from '../models/User';

export const usePullRequests = (
  preloadedQuery: PreloadedQuery<SearchPullRequestsQueryType>
) => {
  const [loginUser] = useAtom(userAtom);

  const data = usePreloadedQuery<SearchPullRequestsQueryType>(
    SearchPullRequestsQuery,
    preloadedQuery
  );

  const searchPullRequests = (data.search.nodes?.filter(
    (node) => node != null
  ) ?? []) as Array<SearchPullRequest>;

  const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) => {
    return pullRequestMapper.toModelFromSearchPullRequest(
      pr,
      loginUser as User
    );
  });

  console.log(foo(pullRequests));

  return {
    pullRequests,
  };
};
