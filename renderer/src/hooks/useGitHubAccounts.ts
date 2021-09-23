import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

export type SearchGitHubAccountsQueryResponse = {
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
    const accounts = [];

    const user = data?.viewer.login;
    if (user) {
      accounts.push(user);
    }

    const organizations = data?.viewer.organizations.nodes ?? [];
    for (const org of organizations) {
      if (org?.login) {
        accounts.push(org?.login);
      }
    }

    setAccounts(accounts);
  }, [data]);

  return {
    loading,
    accounts,
  };
};
