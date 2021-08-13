import React, { memo, useCallback, useState } from 'react';
import { PlusCircleIcon, CheckCircleFillIcon } from '@primer/octicons-react';
import { AccountSelect, RepositorySearchBox } from '../../components';
import { useSettings } from '../../hooks';
import { BaseLayout } from '../../layouts/BaseLayout';
import { searchRepositories } from '../../lib/searchRepositories';
import {
  containerStyle,
  iconButtonStyle,
  iconStyle,
  repositoryListItemStyle,
  repositoryListStyle,
  searchContainerStyle,
  titleStyle,
} from './styles.css';

/**
 * TODO: 完了ボタンの追加
 * TODO: 完了ボタンが押された時にPR一覧に遷移
 * TODO: リポジトリが一つも選択されていなかったらアラートを表示（リポジトリを最低一つは選択してください。）
 */

export const SelectRepositoriesPage = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<string[]>([]);
  const { settings, addSubscribedRepository, removeSubscribedRepository } =
    useSettings();

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
        <RepositoryList
          repositories={repositories}
          subscribedRepositories={settings.subscribedRepositories}
          addRepository={addSubscribedRepository}
          removeRepository={removeSubscribedRepository}
        />
      </div>
    </BaseLayout>
  );
};

type RepositoryListProps = {
  repositories: string[];
  subscribedRepositories: string[];
  addRepository: (repository: string) => void;
  removeRepository: (repository: string) => void;
};

const RepositoryList = memo<RepositoryListProps>(
  ({
    repositories,
    subscribedRepositories,
    addRepository,
    removeRepository,
  }) => {
    return (
      <ul className={repositoryListStyle}>
        {repositories.map((repository) => (
          <li key={repository} className={repositoryListItemStyle}>
            <div>{repository}</div>
            {subscribedRepositories.includes(repository) ? (
              <button
                onClick={() => removeRepository(repository)}
                className={iconButtonStyle}
              >
                <CheckCircleFillIcon className={iconStyle} size={24} />
              </button>
            ) : (
              <button
                onClick={() => addRepository(repository)}
                className={iconButtonStyle}
              >
                <PlusCircleIcon className={iconStyle} size={24} />
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  }
);
