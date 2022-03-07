import { useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import { ApolloQueryResult, gql } from '@apollo/client';
import { loginUserAtom } from '../jotai/user';
import { PullRequest } from '../models/PullRequest';
import { User } from '../models/User';
import { useSettings } from './useSettings';
import { buildSearchPullRequestsQuery } from '../lib';
import { client } from '../lib/apollo';
import { useAtomValue } from 'jotai/utils';
import {
  pullRequestsReducerAtom,
  START_FETCH_ACTION,
  UPDATE_ACTION,
} from '../jotai/pullRequest';

type TypeWithGenerics<T> = T[] | ReadonlyArray<T>;
type ExtractGenerics<T> = T extends TypeWithGenerics<infer X> ? X : never;

export type SearchPullRequestsQueryResponse = {
  readonly search: {
    readonly nodes: ReadonlyArray<{
      readonly headRefName?: string;
      readonly title?: string;
      readonly url?: string;
      readonly author?: {
        readonly avatarUrl: string;
        readonly login: string;
      } | null;
      readonly repository?: {
        readonly nameWithOwner: string;
        readonly openGraphImageUrl: string;
      };
      readonly reviews?: {
        readonly totalCount: number;
      } | null;
      readonly reviewRequests?: {
        readonly totalCount: number;
        readonly nodes: ReadonlyArray<{
          readonly requestedReviewer: {
            readonly login?: string;
          } | null;
        } | null> | null;
      } | null;
    } | null> | null;
  };
};

export type SearchPullRequest = Exclude<
  ExtractGenerics<SearchPullRequestsQueryResponse['search']['nodes']>,
  null
>;

export const SearchPullRequestsQuery = gql`
  query SearchPullRequestsQuery(
    $login_user_name: String!
    $search_query: String!
  ) {
    search(type: ISSUE, query: $search_query, last: 100) {
      nodes {
        ... on PullRequest {
          headRefName
          title
          url
          author {
            avatarUrl
            login
          }
          repository {
            nameWithOwner
            openGraphImageUrl
          }
          reviews(author: $login_user_name, states: [APPROVED], last: 100) {
            totalCount
          }
          reviewRequests(last: 100) {
            totalCount
            nodes {
              requestedReviewer {
                ... on User {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * プルリクエストのステータス文字列を生成する
 *
 * ステータス:
 *   requestedReview(レビュー待ち): requestedReviewer に自分が含まれている
 *   approved(承認済み): 自分の state: APPROVED のレビューが存在する
 *   reviewing(レビュー中): 上記以外のプルリクエスト
 */
export const getPullRequestStatus = (
  pr: SearchPullRequest,
  loginUser: User
): PullRequest['status'] => {
  const isRequestedReview = pr.reviewRequests?.nodes?.some(
    (node) => node?.requestedReviewer?.login === loginUser.name
  );

  if (isRequestedReview) {
    return 'requestedReview';
  }

  const totalCount = pr.reviews?.totalCount ?? 0;
  const isApproved = totalCount > 0;
  if (isApproved) {
    return 'approved';
  }

  return 'reviewing';
};

const toModelFromSearchPullRequest = (
  pr: SearchPullRequest,
  loginUser: User
): PullRequest => {
  const basePullRequest: Omit<PullRequest, 'status'> = {
    title: pr.title ?? '',
    url: pr.url ?? '',
    repository: {
      nameWithOwner: pr.repository?.nameWithOwner ?? '',
      openGraphImageUrl: pr.repository?.openGraphImageUrl ?? '',
    },
    author: {
      name: pr.author?.login ?? '',
      avatarUrl: pr.author?.avatarUrl ?? '',
    },
  };

  return {
    ...basePullRequest,
    status: getPullRequestStatus(pr, loginUser),
  };
};

export const useWatchPullRequests = () => {
  const [, dispatch] = useAtom(pullRequestsReducerAtom);
  const loginUser = useAtomValue(loginUserAtom);
  const { settings } = useSettings();

  const watchedQuery = useMemo(() => {
    return client.watchQuery<SearchPullRequestsQueryResponse>({
      query: SearchPullRequestsQuery,
      variables: {
        login_user_name: loginUser?.name,
        search_query: buildSearchPullRequestsQuery(
          settings.subscribedRepositories
        ),
      },
      fetchPolicy: 'cache-and-network',
    });
  }, [loginUser?.name, settings.subscribedRepositories]);

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
      const pullRequests = parseQueryResponse(result.data);
      dispatch({ type: UPDATE_ACTION, payload: { pullRequests } });
    },
    [dispatch, parseQueryResponse]
  );

  const startPolling = useCallback(
    (interval: number) => {
      watchedQuery.subscribe(onResponse);
      watchedQuery.startPolling(interval);
      dispatch({ type: START_FETCH_ACTION });
    },
    [watchedQuery, dispatch, onResponse]
  );

  const stopPolling = useCallback(() => {
    watchedQuery.stopPolling();
  }, [watchedQuery]);

  return {
    startPolling,
    stopPolling,
  };
};
