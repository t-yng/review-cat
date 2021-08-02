import { graphql } from 'relay-runtime';
import { SearchPullRequestsQueryResponse } from './__generated__/SearchPullRequestsQuery.graphql';

type TypeWithGenerics<T> = T[] | ReadonlyArray<T>;
type ExtractGenerics<T> = T extends TypeWithGenerics<infer X> ? X : never;

export type SearchPullRequest = Exclude<
  ExtractGenerics<SearchPullRequestsQueryResponse['search']['nodes']>,
  null
>;

export const SearchPullRequestsQuery = graphql`
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
