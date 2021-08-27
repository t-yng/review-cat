import React, { memo, useEffect } from 'react';
import { useCallback, useState, FC } from 'react';
import { useRelayEnvironment, fetchQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { AccountSelect, RepositorySearchBox } from '../';
import { searchRepositories } from '../../lib/searchRepositories';
import { rootStyle } from './style.css';
import type { SearchRepositoryAccountsQuery as SearchRepositoryAccountsQueryType } from './__generated__/SearchRepositoryAccountsQuery.graphql';

type SearchRepositoryProps = {
  onSearch: (repositories: string[]) => void;
};

export const SearchRepositoryAccountsQuery = graphql`
  query SearchRepositoryAccountsQuery {
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

export const SearchRepository: FC<SearchRepositoryProps> = memo(
  ({ onSearch }) => {
    const environment = useRelayEnvironment();
    const [account, setAccount] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<string[]>([]);

    useEffect(() => {
      fetchQuery<SearchRepositoryAccountsQueryType>(
        environment,
        SearchRepositoryAccountsQuery,
        {}
      ).subscribe({
        next: (data) => {
          const nodes = data.viewer.organizations.nodes;
          if (nodes == null) return;
          const accounts = nodes
            .map((node) => node?.login)
            .filter((org) => org != null) as string[];
          setAccounts([data.viewer.login, ...accounts]);
        },
      });
    }, [environment]);

    const handleSearch = useCallback(
      async (keyword: string) => {
        const repositories = await searchRepositories(account ?? '', keyword);
        onSearch(repositories);
      },
      [account, onSearch]
    );

    const handleAccountSelect = useCallback((account: string) => {
      setAccount(account);
    }, []);

    return (
      <div className={rootStyle}>
        <AccountSelect accounts={accounts} onSelect={handleAccountSelect} />
        <RepositorySearchBox onSearch={handleSearch} />
      </div>
    );
  }
);
