import { useSuspenseQuery } from '@apollo/client';
import { PullRequest, User } from '@/models';
import { useSetting, useAuth } from '@/stores';
import { buildSearchPullRequestsQuery } from '@/lib';
import { toModelFromSearchPullRequest } from './helper';
import {
  SearchPullRequestFragment as SearchPullRequest,
  SearchPullRequestsDocument,
  SearchPullRequestsQuery,
  SearchPullRequestsQueryVariables,
} from '@/gql/generated';

export const usePullRequests = () => {
  const { user } = useAuth();
  const { setting } = useSetting();

  const { data } = useSuspenseQuery<
    SearchPullRequestsQuery,
    SearchPullRequestsQueryVariables
  >(SearchPullRequestsDocument, {
    variables: {
      search_query: buildSearchPullRequestsQuery(
        setting.subscribedRepositories
      ),
    },
    fetchPolicy: 'cache-and-network',
  });

  const searchPullRequests = (data?.search.nodes?.filter(
    (node) => node != null
  ) ?? []) as Array<SearchPullRequest>;

  const pullRequests: PullRequest[] = searchPullRequests.map((pr) =>
    toModelFromSearchPullRequest(pr, user as User)
  );

  return { pullRequests };
};
