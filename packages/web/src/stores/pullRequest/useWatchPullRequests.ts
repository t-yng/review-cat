import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { ApolloQueryResult } from '@apollo/client';
import { PullRequest, User } from '@/models';
import { useSetting, useAuth } from '@/stores';
import { buildSearchPullRequestsQuery } from '@/lib';
import { client } from '@/lib/apollo';
import { firstLoadingState, pullRequestsState } from './pullRequest';
import { notifyPullRequests } from '@/lib/notification';
import { toModelFromSearchPullRequest } from './helper';
import {
  SearchPullRequestFragment as SearchPullRequest,
  SearchPullRequestsDocument,
  SearchPullRequestsQuery,
} from '@/gql/generated';

export const useWatchPullRequests = () => {
  const setFirstLoading = useSetRecoilState(firstLoadingState);
  const setPullRequests = useSetRecoilState(pullRequestsState);
  const { user } = useAuth();
  const { setting } = useSetting();

  const watchedQuery = useMemo(() => {
    return client.watchQuery<SearchPullRequestsQuery>({
      query: SearchPullRequestsDocument,
      variables: {
        search_query: buildSearchPullRequestsQuery(
          setting.subscribedRepositories
        ),
      },
      fetchPolicy: 'cache-and-network',
    });
  }, [setting.subscribedRepositories]);

  const parseQueryResponse = useCallback(
    (response: SearchPullRequestsQuery) => {
      const searchPullRequests = (response.search.nodes?.filter(
        (node) => node != null
      ) ?? []) as Array<SearchPullRequest>;

      const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) => {
        return toModelFromSearchPullRequest(pr, user as User);
      });

      return pullRequests;
    },
    [user]
  );

  const onResponse = useCallback(
    (result: ApolloQueryResult<SearchPullRequestsQuery>) => {
      if (result.error) {
        console.error('[useWatchPullRequests] GraphQL error:', result.error);
        setFirstLoading(false);
        return;
      }

      if (user == null) {
        console.warn(
          '[useWatchPullRequests] onResponse called but user is null, skipping'
        );
        return;
      }

      const pullRequests = parseQueryResponse(result.data);
      setPullRequests((prevPullRequests) => {
        notifyPullRequests(user, pullRequests, prevPullRequests);
        return pullRequests;
      });
      setFirstLoading(false);
    },
    [user, parseQueryResponse, setFirstLoading, setPullRequests]
  );

  const onError = useCallback(
    (error: Error) => {
      console.error('[useWatchPullRequests] subscription error:', error);
      setFirstLoading(false);
    },
    [setFirstLoading]
  );

  const startPolling = useCallback(
    (interval: number) => {
      watchedQuery.subscribe({ next: onResponse, error: onError });
      watchedQuery.startPolling(interval);
      setFirstLoading(true);
    },
    [watchedQuery, onResponse, onError, setFirstLoading]
  );

  const stopPolling = useCallback(() => {
    watchedQuery.stopPolling();
  }, [watchedQuery]);

  return {
    startPolling,
    stopPolling,
  };
};
