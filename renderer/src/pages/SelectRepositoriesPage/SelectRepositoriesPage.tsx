import React, { useCallback, useState } from 'react';
import { AccountSelect, RepositorySearchBox } from '../../components';
import { BaseLayout } from '../../layouts/BaseLayout';
import { searchRepositories } from '../../lib/searchRepositories';
import {
  containerStyle,
  repositoryListItemStyle,
  repositoryListStyle,
  searchContainerStyle,
  titleStyle,
} from './styles.css';

export const SelectRepositoriesPage = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<string[]>([]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      const repositories = await searchRepositories(account ?? '', keyword);
      setRepositories(repositories);
    },
    [account]
  );

  const handleAccountSelect = useCallback((account: string) => {
    setAccount(account);
  }, []);

  return (
    <BaseLayout>
      <div className={containerStyle}>
        <h1 className={titleStyle}>リポジトリを選択</h1>
        <div className={searchContainerStyle}>
          <AccountSelect onSelect={handleAccountSelect} />
          <RepositorySearchBox onSearch={handleSearch} />
        </div>
        {/* TODO: リポジトリ一覧を実装 追加ボタンが押されたらコールバックを処理する */}
        <ul className={repositoryListStyle}>
          {repositories.map((repository) => (
            <li key={repository} className={repositoryListItemStyle}>
              <div>{repository}</div>
            </li>
          ))}
        </ul>
      </div>
    </BaseLayout>
  );
};
