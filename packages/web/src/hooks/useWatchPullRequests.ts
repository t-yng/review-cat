import { useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import { ApolloQueryResult, gql } from '@apollo/client';
import { PullRequest, pullRequestStatus, User } from '@/models';
import { useSetting, useAuth } from '@/stores';
import { buildSearchPullRequestsQuery } from '@/lib';
import { client } from '@/lib/apollo';
import {
  pullRequestsReducerAtom,
  START_FETCH_ACTION,
  UPDATE_ACTION,
} from '@/jotai/pullRequest';

type TypeWithGenerics<T> = T[] | ReadonlyArray<T>;
type ExtractGenerics<T> = T extends TypeWithGenerics<infer X> ? X : never;

export type SearchPullRequestsQueryResponse = {
  readonly search: {
    readonly nodes: ReadonlyArray<{
      readonly headRefName?: string;
      readonly title: string;
      readonly url: string;
      readonly reviewDecision:
        | 'APPROVED'
        | 'CHANGES_REQUESTED'
        | 'REVIEW_REQUIRED';
      readonly author?: {
        readonly avatarUrl: string;
        readonly login: string;
      } | null;
      readonly repository?: {
        readonly nameWithOwner: string;
        readonly openGraphImageUrl: string;
      };
      readonly reviews?: {
        nodes: ReadonlyArray<{
          readonly state:
            | 'PENDING'
            | 'COMMENTED'
            | 'APPROVED'
            | 'CHANGES_REQUESTED'
            | 'DISMISSED';
          readonly author: {
            readonly login: string;
          };
        }>;
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
  query SearchPullRequestsQuery($search_query: String!) {
    search(type: ISSUE, query: $search_query, last: 100) {
      nodes {
        ... on PullRequest {
          headRefName
          title
          url
          reviewDecision
          author {
            avatarUrl
            login
          }
          repository {
            nameWithOwner
            openGraphImageUrl
          }
          reviews(last: 100) {
            nodes {
              ... on PullRequestReview {
                state
                author {
                  login
                }
              }
            }
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
  const reviewRequestedAuthors =
    pr.reviewRequests?.nodes?.map((n) => n?.requestedReviewer?.login) ?? [];
  const reviewAuthors = pr.reviews?.nodes.map((n) => n.author.login) ?? [];
  const reviewers = Array.from(
    new Set([...reviewRequestedAuthors, ...reviewAuthors])
  );

  // PRのオーナーが自分の場合のプルリクのステータス
  if (pr.author?.login === loginUser.name) {
    // レビューリクエストに全てのレビュアーが含まれていたらレビュー待ちと判定
    if (reviewRequestedAuthors.length === reviewers.length) {
      return pullRequestStatus.waitingReview;
    } else if (pr.reviewDecision === 'APPROVED') {
      return pullRequestStatus.approved;
    } else {
      return pullRequestStatus.reviewed;
    }
  }
  // PRのオーナーが自分以外の場合のプルリクのステータス
  else {
    const approvedReviewAuthors =
      pr.reviews?.nodes
        .filter((n) => n.state === 'APPROVED')
        .map((n) => n.author.login) ?? [];

    // reviewRequests に自分が含まれている場合はレビュー待ちと判定
    if (reviewRequestedAuthors.includes(loginUser.name)) {
      return pullRequestStatus.waitingReview;
    }
    // 自分が承認済みのレビューがある場合は承認済みと判定
    else if (approvedReviewAuthors.includes(loginUser.name)) {
      return pullRequestStatus.approved;
    } else {
      return pullRequestStatus.reviewed;
    }
  }
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
      dispatch({ type: UPDATE_ACTION, payload: { loginUser, pullRequests } });
    },
    [dispatch, loginUser, parseQueryResponse]
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
