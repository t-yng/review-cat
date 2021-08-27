import { useCallback } from 'react';
import { useRelayEnvironment, fetchQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { useSearchRepositoryQuery } from './__generated__/useSearchRepositoryQuery.graphql';

export type Repository = {
  name: string;
  url: string;
};

const SearchRepositoryQuery = graphql`
  query useSearchRepositoryQuery($query: String!) {
    search(type: REPOSITORY, query: $query, last: 100) {
      nodes {
        ... on Repository {
          name
          url
        }
      }
    }
  }
`;

export const useSearchRepository = () => {
  const environment = useRelayEnvironment();

  const search = useCallback(
    async (options: {
      account: string;
      keyword: string;
      isOrganization: boolean;
    }): Promise<{ name: string; url: string }[]> => {
      return new Promise((resolve) => {
        const accountModifier = options.isOrganization ? 'org' : 'user';
        const query = `${options.keyword} ${accountModifier}:${options.account}`;
        fetchQuery<useSearchRepositoryQuery>(
          environment,
          SearchRepositoryQuery,
          { query: query }
        ).subscribe({
          next: (data) => {
            const repositories = data.search.nodes;
            resolve(repositories as Repository[]);
          },
        });
      });
    },
    [environment]
  );

  return {
    search,
  };
};
