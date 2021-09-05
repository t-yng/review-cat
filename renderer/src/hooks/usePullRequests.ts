import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { gql, useQuery } from '@apollo/client';
import { userAtom } from '../jotai/user';
import { PullRequest } from '../models/PullRequest';
import { User } from '../models/User';
import { useSettings } from './useSettings';
import { buildSearchPullRequestsQuery } from '../lib';

type TypeWithGenerics<T> = T[] | ReadonlyArray<T>;
type ExtractGenerics<T> = T extends TypeWithGenerics<infer X> ? X : never;

type SearchPullRequestsQueryResponse = {
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

export const usePullRequests = ({
  fetchInterval = 0,
}: { fetchInterval?: number } = {}) => {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loginUser] = useAtom(userAtom);
  const { settings } = useSettings();

  const { loading, data } = useQuery<SearchPullRequestsQueryResponse>(
    SearchPullRequestsQuery,
    {
      variables: {
        login_user_name: loginUser?.name,
        search_query: buildSearchPullRequestsQuery(
          settings.subscribedRepositories
        ),
      },
      pollInterval: fetchInterval,
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (data == null) return;

    const searchPullRequests = (data?.search.nodes?.filter(
      (node) => node != null
    ) ?? []) as Array<SearchPullRequest>;

    const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) => {
      return toModelFromSearchPullRequest(pr, loginUser as User);
    });

    setPullRequests(pullRequests);
  }, [data, loginUser]);

  return {
    loading,
    pullRequests,
  };
};
