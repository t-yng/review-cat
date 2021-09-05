import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { storage } from '../storage';

const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' });

const authMiddleWare = new ApolloLink((operation, forward) => {
  const oAuthToken = storage.getGithubAccessToken();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `bearer ${oAuthToken}`,
      'Content-Type': 'application/json',
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleWare, httpLink),
  cache: new InMemoryCache(),
});
