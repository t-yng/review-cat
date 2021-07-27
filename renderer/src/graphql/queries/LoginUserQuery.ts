import { graphql } from 'relay-runtime';

export const LoginUserQuery = graphql`
  query LoginUserQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;
