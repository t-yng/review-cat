import { useCallback, useState, FC, memo, useEffect } from 'react';
import { useAuth } from '@/stores';
import { AccountSelect, RepositorySearchBox } from '..';
import { useGitHubAccounts } from '@/hooks/useGitHubAccounts';
import { Repository, useSearchRepository } from '@/hooks/useSearchRepository';
import { rootStyle } from './style.css';

type SearchRepositoryProps = {
  onSearch: (repositories: Repository[]) => void;
};

export const SearchRepository: FC<SearchRepositoryProps> = memo(
  ({ onSearch }) => {
    const { loginUser } = useAuth();
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
        const isOrganization = account !== loginUser?.name;
        const repositories = await search({ account, keyword, isOrganization });
        onSearch(repositories);
      },
      [account, loginUser, onSearch, search]
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
