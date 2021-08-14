import React, { memo, useEffect } from 'react';
import { useCallback, useState, FC } from 'react';
import { AccountSelect, RepositorySearchBox } from '..';
import { searchRepositories } from '../../lib/searchRepositories';
import { rootStyle } from './style.css';

type SearchRepositoryProps = {
  onSearch: (repositories: string[]) => void;
};

export const SearchRepository: FC<SearchRepositoryProps> = memo(
  ({ onSearch }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<string[]>([]);

    useEffect(() => {
      // TODO: サクッとアカウントの一覧をAPIで取得する
      const accounts = ['higeOhige'];
      setAccounts(accounts);
    }, []);

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
