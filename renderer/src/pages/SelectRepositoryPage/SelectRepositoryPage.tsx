import React, { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { PlusCircleIcon, CheckCircleFillIcon } from '@primer/octicons-react';
import { SearchRepository, Button } from '../../components';
import { useSettings } from '../../hooks';
import { BaseLayout } from '../../layouts/BaseLayout';
import {
  completeButtonStyle,
  containerStyle,
  iconButtonStyle,
  iconStyle,
  repositoryListItemStyle,
  repositoryListStyle,
  titleStyle,
} from './styles.css';
import { themeFocusVisibleOutline } from '../../theme.css';

export const SelectRepositoryPage = () => {
  const history = useHistory();
  const [repositories, setRepositories] = useState<string[]>([]);
  const { settings, addSubscribedRepository, removeSubscribedRepository } =
    useSettings();

  const handleSearch = useCallback(async (repositories: string[]) => {
    setRepositories(repositories);
  }, []);

  const handleClick = useCallback(() => {
    if (settings.subscribedRepositories.length === 0) {
      alert('レビュー対象のリポジトリを1つ以上選択してください。');
    } else {
      history.replace('/');
    }
  }, [settings, history]);

  return (
    <BaseLayout>
      <div className={containerStyle}>
        <h1 className={titleStyle}>リポジトリを選択</h1>
        <SearchRepository onSearch={handleSearch} />
        {repositories.length > 0 && (
          <RepositoryList
            repositories={repositories}
            subscribedRepositories={settings.subscribedRepositories}
            addRepository={addSubscribedRepository}
            removeRepository={removeSubscribedRepository}
          />
        )}
        <Button className={completeButtonStyle} onClick={handleClick}>
          完了
        </Button>
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
                className={classNames(
                  iconButtonStyle,
                  themeFocusVisibleOutline
                )}
                title={`${repository}を設定に追加する`}
              >
                <CheckCircleFillIcon className={iconStyle} size={24} />
              </button>
            ) : (
              <button
                onClick={() => addRepository(repository)}
                className={classNames(
                  iconButtonStyle,
                  themeFocusVisibleOutline
                )}
                title={`${repository}を設定から削除する`}
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
