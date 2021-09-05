import { useAtom } from 'jotai';
import React, { memo, useEffect } from 'react';
import { useCallback, useState, FC } from 'react';
import { AccountSelect, RepositorySearchBox } from '..';
import { useGitHubAccounts } from '../../hooks/useGitHubAccounts';
import {
  Repository,
  useSearchRepository,
} from '../../hooks/useSearchRepository';
import { loginUserAtom } from '../../jotai';
import { rootStyle } from './style.css';

type SearchRepositoryProps = {
  onSearch: (repositories: Repository[]) => void;
};

export const SearchRepository: FC<SearchRepositoryProps> = memo(
  ({ onSearch }) => {
    const [user] = useAtom(loginUserAtom);
    const [account, setAccount] = useState<string | null>(null);
    const { accounts } = useGitHubAccounts();
    const { search } = useSearchRepository();

    useEffect(() => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }, [accounts]);

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
