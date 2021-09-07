import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

type SearchGitHubAccountsQueryResponse = {
  readonly viewer: {
    readonly login: string;
    readonly organizations: {
      readonly nodes: ReadonlyArray<{
        readonly avatarUrl: string;
        readonly login: string;
      } | null> | null;
    };
  };
};

export const SearchGitHubAccountsQuery = gql`
  query SearchGitHubAccountsQuery {
    viewer {
      login
      organizations(first: 20) {
        nodes {
          avatarUrl
          login
        }
      }
    }
  }
`;

export const useGitHubAccounts = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const { loading, data } = useQuery<SearchGitHubAccountsQueryResponse>(
    SearchGitHubAccountsQuery
  );

  useEffect(() => {
    const nodes = data?.viewer.organizations.nodes;
    if (nodes == null) return;

    const accounts = nodes
      .map((node) => node?.login)
      .filter((org) => org != null) as string[];

    setAccounts(accounts);
  }, [data]);

  return {
    loading,
    accounts,
  };
};
