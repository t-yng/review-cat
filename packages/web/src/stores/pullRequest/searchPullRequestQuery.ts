import { gql } from '@apollo/client';

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
