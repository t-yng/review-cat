import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { client } from '../lib/apollo';

export type Repository = {
  nameWithOwner: string;
  url: string;
};

type SearchRepositoryQueryResponse = {
  readonly search: {
    readonly nodes: ReadonlyArray<{
      readonly nameWithOwner?: string;
      readonly url?: string;
    } | null> | null;
  };
};

const SearchRepositoryQuery = gql`
  query SearchRepositoryQuery($query: String!) {
    search(type: REPOSITORY, query: $query, last: 100) {
      nodes {
        ... on Repository {
          nameWithOwner
          url
        }
      }
    }
  }
`;

export const useSearchRepository = () => {
  const search = useCallback(
    async (options: {
      account: string;
      keyword: string;
      isOrganization: boolean;
    }): Promise<Repository[]> => {
      return new Promise((resolve) => {
        const accountModifier = options.isOrganization ? 'org' : 'user';
        const query = `${options.keyword} ${accountModifier}:${options.account}`;
        client
          .query<SearchRepositoryQueryResponse>({
            query: SearchRepositoryQuery,
            variables: { query },
            fetchPolicy: 'network-only',
          })
          .then((res) => {
            const repositories = res.data.search.nodes;
            resolve(repositories as Repository[]);
          });
      });
    },
    []
  );

  return {
    search,
  };
};
