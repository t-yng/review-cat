import { useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { PullRequest, User } from '@/models';
import { useSetting, useAuth } from '@/stores';
import { buildSearchPullRequestsQuery } from '@/lib';
import { notifyPullRequests } from '@/lib/notification';
import { toModelFromSearchPullRequest } from './helper';
import {
  SearchPullRequestFragment as SearchPullRequest,
  SearchPullRequestsDocument,
  SearchPullRequestsQuery,
  SearchPullRequestsQueryVariables,
} from '@/gql/generated';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

export const useWatchPullRequests = () => {
  const { user } = useAuth();
  const { setting } = useSetting();
  const prevPullRequestsRef = useRef<PullRequest[]>([]);

  const { data, startPolling, stopPolling } = useQuery<
    SearchPullRequestsQuery,
    SearchPullRequestsQueryVariables
  >(SearchPullRequestsDocument, {
    variables: {
      search_query: buildSearchPullRequestsQuery(
        setting.subscribedRepositories
      ),
    },
    fetchPolicy: 'cache-and-network',
    skip: user == null,
  });

  const startWatching = useCallback(() => {
    startPolling(FETCH_PULL_REQUESTS_INTERVAL);
  }, [startPolling]);

  const stopWatching = useCallback(() => {
    stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (!data || !user) return;

    const searchPullRequests = (data.search.nodes?.filter(
      (node) => node != null
    ) ?? []) as Array<SearchPullRequest>;

    const pullRequests: PullRequest[] = searchPullRequests.map((pr) =>
      toModelFromSearchPullRequest(pr, user)
    );

    notifyPullRequests(user, pullRequests, prevPullRequestsRef.current);
    prevPullRequestsRef.current = pullRequests;
  }, [data, user]);

  return {
    startPolling: startWatching,
    stopPolling: stopWatching,
  };
};
