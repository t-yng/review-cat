import { graphql } from 'relay-runtime';

export const SearchPullRequest = graphql`
  fragment SearchPullRequest on PullRequest {
    headRefName
    title
    author {
      avatarUrl
      login
    }
    repository {
      nameWithOwner
    }
    reviews(author: "t-yng", states: [APPROVED], last: 100) {
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
`;

export const SearchPullRequestViewer = graphql`
  fragment SearchPullRequestViewer on User {
    login
  }
`;

export const SearchPullRequestsQuery = graphql`
  query SearchPullRequestsQuery {
    viewer {
      ...SearchPullRequestViewer
    }
    search(
      type: ISSUE
      query: "type:pr state:open involves:@me -author:@me repo:t-yng/blog repo:yamap-inc/yamap-web"
      last: 100
    ) {
      nodes {
        ...SearchPullRequest
      }
    }
  }
`;
