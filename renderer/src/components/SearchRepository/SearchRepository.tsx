import { useAtom } from 'jotai';
import React, { memo, useEffect } from 'react';
import { useCallback, useState, FC } from 'react';
import { useRelayEnvironment, fetchQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { AccountSelect, RepositorySearchBox } from '..';
import {
  Repository,
  useSearchRepository,
} from '../../hooks/useSearchRepository';
import { loginUserAtom } from '../../jotai';
import { rootStyle } from './style.css';
import type { SearchRepositoryAccountsQuery as SearchRepositoryAccountsQueryType } from './__generated__/SearchRepositoryAccountsQuery.graphql';

type SearchRepositoryProps = {
  onSearch: (repositories: Repository[]) => void;
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
    const [user] = useAtom(loginUserAtom);
    const [account, setAccount] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<string[]>([]);
    const { search } = useSearchRepository();

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
          setAccount(accounts[0]);
        },
      });
    }, [environment]);

    const handleSearch = useCallback(
      async (keyword: string) => {
        if (account == null) {
          alert('アカウントを選択してください');
          return;
        }
        const isOrganization = account !== user?.name;
        const repositories = await search({ account, keyword, isOrganization });
        onSearch(repositories);
      },
      [account, onSearch, search, user]
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
