import { useState, useEffect } from 'react';
import { useSearchGitHubAccountsQuery } from '@/gql/generated';

export const useGitHubAccounts = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const { loading, data } = useSearchGitHubAccountsQuery();

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
