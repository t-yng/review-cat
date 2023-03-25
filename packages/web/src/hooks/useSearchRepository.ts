import { useCallback } from 'react';
import { client } from '../lib/apollo';
import {
  SearchRepositoryDocument,
  SearchRepositoryQueryResult,
} from '@/gql/generated';

export type Repository = {
  nameWithOwner: string;
  url: string;
};

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
          .query<SearchRepositoryQueryResult['data']>({
            query: SearchRepositoryDocument,
            variables: { query },
            fetchPolicy: 'network-only',
          })
          .then((res) => {
            const repositories = res?.data?.search.nodes;
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
