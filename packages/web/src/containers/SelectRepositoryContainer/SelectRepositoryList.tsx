import React, { memo, FC } from 'react';
import classNames from 'classnames';
import { CheckCircleFillIcon, PlusCircleIcon } from '@primer/octicons-react';
import {
  repositoryListStyle,
  repositoryLinkStyle,
  iconButtonStyle,
  iconStyle,
  repositoryListItemStyle,
} from './style.css';
import { themeFocusVisibleOutline } from '../../theme.css';
import { Repository } from '../../hooks/useSearchRepository';

type AddRepositoryButtonProps = {
  repository: Repository;
  onClick: (repository: string) => void;
};

const AddRepositoryButton = memo<AddRepositoryButtonProps>(
  ({ repository, onClick }) => {
    return (
      <button
        onClick={() => onClick(repository.nameWithOwner)}
        className={classNames(iconButtonStyle, themeFocusVisibleOutline)}
        aria-label="リポジトリを設定に追加する"
      >
        <PlusCircleIcon className={iconStyle} size={24} />
      </button>
    );
  }
);

type DeleteRepositoryButtonProps = {
  repository: Repository;
  onClick: (repository: string) => void;
};

const DeleteRepositoryButton = memo<DeleteRepositoryButtonProps>(
  ({ repository, onClick }) => {
    return (
      <button
        onClick={() => onClick(repository.nameWithOwner)}
        className={classNames(iconButtonStyle, themeFocusVisibleOutline)}
        aria-label="設定からリポジトリを削除する"
      >
        <CheckCircleFillIcon className={iconStyle} size={24} />
      </button>
    );
  }
);

type RepositoryListItemProps = {
  repository: Repository;
  subscribed: boolean;
  addRepository: SelectRepositoryListProps['addRepository'];
  removeRepository: SelectRepositoryListProps['removeRepository'];
};

const RepositoryListItem = memo<RepositoryListItemProps>(
  ({ repository, subscribed, addRepository, removeRepository }) => {
    return (
      <li className={repositoryListItemStyle}>
        <a
          href={repository.url}
          target="_blank"
          rel="noopner noreferrer"
          className={repositoryLinkStyle}
        >
          {repository.nameWithOwner}
        </a>
        {subscribed ? (
          <DeleteRepositoryButton
            repository={repository}
            onClick={removeRepository}
          />
        ) : (
          <AddRepositoryButton
            repository={repository}
            onClick={addRepository}
          />
        )}
      </li>
    );
  }
);

export type SelectRepositoryListProps = {
  repositories: Repository[];
  subscribedRepositories: string[];
  addRepository: (repository: string) => void;
  removeRepository: (repository: string) => void;
};

export const SelectRepositoryList: FC<SelectRepositoryListProps> = ({
  repositories,
  subscribedRepositories,
  addRepository,
  removeRepository,
}) => {
  return (
    <ul className={repositoryListStyle}>
      {repositories.map((repository) => (
        <RepositoryListItem
          key={repository.nameWithOwner}
          repository={repository}
          subscribed={subscribedRepositories.includes(repository.nameWithOwner)}
          addRepository={addRepository}
          removeRepository={removeRepository}
        />
      ))}
    </ul>
  );
};
