import { useAtom } from 'jotai';
import { gql, useQuery } from '@apollo/client';
import { pullRequestMapper } from '../graphql/mapper';
import { userAtom } from '../jotai/user';
import { PullRequest } from '../models/PullRequest';
import { User } from '../models/User';
import { useSettings } from './useSettings';
import { buildSearchPullRequestsQuery } from '../graphql/queries/builder';

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

type SearchPullRequest = Exclude<
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

export const usePullRequests = ({
  fetchInterval = 0,
}: { fetchInterval?: number } = {}) => {
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

  const searchPullRequests = (data?.search.nodes?.filter(
    (node) => node != null
  ) ?? []) as Array<SearchPullRequest>;

  const pullRequests: Array<PullRequest> = searchPullRequests.map((pr) => {
    return pullRequestMapper.toModelFromSearchPullRequest(
      pr,
      loginUser as User
    );
  });

  return {
    loading,
    pullRequests,
  };
};
