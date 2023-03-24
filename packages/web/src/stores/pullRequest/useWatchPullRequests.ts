import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { ApolloQueryResult } from '@apollo/client';
import { PullRequest, User } from '@/models';
import { useSetting, useAuth } from '@/stores';
import { buildSearchPullRequestsQuery } from '@/lib';
import { client } from '@/lib/apollo';
import { firstLoadingState, pullRequestsState } from './pullRequest';
import { notifyPullRequests } from '@/lib/notification';
import {
  SearchPullRequest,
  SearchPullRequestsQuery,
  SearchPullRequestsQueryResponse,
} from './searchPullRequestQuery';
import { toModelFromSearchPullRequest } from './helper';

export const useWatchPullRequests = () => {
  const setFirstLoading = useSetRecoilState(firstLoadingState);
  const setPullRequests = useSetRecoilState(pullRequestsState);
  const { loginUser } = useAuth();
  const { setting } = useSetting();

  const watchedQuery = useMemo(() => {
    return client.watchQuery<SearchPullRequestsQueryResponse>({
      query: SearchPullRequestsQuery,
      variables: {
        search_query: buildSearchPullRequestsQuery(
          setting.subscribedRepositories
        ),
      },
      fetchPolicy: 'cache-and-network',
    });
  }, [setting.subscribedRepositories]);

  const parseQueryResponse = useCallback(
    (response: SearchPullRequestsQueryResponse) => {
      const searchPullRequests = (response.search.nodes?.filter(
        (node) => node != null
      ) ?? []) as Array<SearchPullRequest>;

      const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) => {
        return toModelFromSearchPullRequest(pr, loginUser as User);
      });

      return pullRequests;
    },
    [loginUser]
  );

  const onResponse = useCallback(
    (result: ApolloQueryResult<SearchPullRequestsQueryResponse>) => {
      if (loginUser == null) return;
      const pullRequests = parseQueryResponse(result.data);
      setPullRequests((prevPullRequests) => {
        notifyPullRequests(loginUser, pullRequests, prevPullRequests);
        return pullRequests;
      });
      setFirstLoading(false);
    },
    [loginUser, parseQueryResponse, setFirstLoading, setPullRequests]
  );

  const startPolling = useCallback(
    (interval: number) => {
      watchedQuery.subscribe(onResponse);
      watchedQuery.startPolling(interval);
      setFirstLoading(true);
    },
    [watchedQuery, onResponse, setFirstLoading]
  );

  const stopPolling = useCallback(() => {
    watchedQuery.stopPolling();
  }, [watchedQuery]);

  return {
    startPolling,
    stopPolling,
  };
};
