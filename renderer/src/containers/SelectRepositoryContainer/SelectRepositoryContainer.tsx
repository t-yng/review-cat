import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { CheckCircleFillIcon, PlusCircleIcon } from '@primer/octicons-react';
import { SearchRepository } from '../../components';
import {
  repositoryListStyle,
  repositoryLinkStyle,
  iconButtonStyle,
  iconStyle,
  repositoryListItemStyle,
} from './style.css';
import { themeFocusVisibleOutline } from '../../theme.css';
import { Repository } from '../../hooks/useSearchRepository';
import { useSettings } from '../../hooks';

export const SelectRepositoryContainer = memo(() => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { settings, addSubscribedRepository, removeSubscribedRepository } =
    useSettings();

  const handleSearch = useCallback(async (repositories: Repository[]) => {
    setRepositories(repositories);
  }, []);

  return (
    <div>
      <SearchRepository onSearch={handleSearch} />
      {repositories.length > 0 && (
        <RepositoryList
          repositories={repositories}
          subscribedRepositories={settings.subscribedRepositories}
          addRepository={addSubscribedRepository}
          removeRepository={removeSubscribedRepository}
        />
      )}
    </div>
  );
});

type RepositoryListProps = {
  repositories: Repository[];
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
          <li
            key={repository.nameWithOwner}
            className={repositoryListItemStyle}
          >
            <a
              href={repository.url}
              target="_blank"
              rel="noopner noreferrer"
              className={repositoryLinkStyle}
            >
              {repository.nameWithOwner}
            </a>
            {subscribedRepositories.includes(repository.nameWithOwner) ? (
              <button
                onClick={() => removeRepository(repository.nameWithOwner)}
                className={classNames(
                  iconButtonStyle,
                  themeFocusVisibleOutline
                )}
                title={`${repository}を設定から削除する`}
              >
                <CheckCircleFillIcon className={iconStyle} size={24} />
              </button>
            ) : (
              <button
                onClick={() => addRepository(repository.nameWithOwner)}
                className={classNames(
                  iconButtonStyle,
                  themeFocusVisibleOutline
                )}
                title={`${repository}を設定に追加する`}
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
