import { render, screen, queryByRole } from '@testing-library/react';
import {
  SelectRepositoryList,
  SelectRepositoryListProps,
} from './SelectRepositoryList';
import userEvent from '@testing-library/user-event';

describe('SelectRepositoryList', () => {
  const user = userEvent.setup();

  const renderSelectRepositoryList = (
    props: Partial<SelectRepositoryListProps> = {}
  ) => {
    const defaultProps: SelectRepositoryListProps = {
      repositories: [
        {
          nameWithOwner: 'test/testA',
          url: 'https://github.com/test/testA',
        },
        {
          nameWithOwner: 'test/testB',
          url: 'https://github.com/test/testB',
        },
      ],
      subscribedRepositories: ['test/testA'],
      addRepository: jest.fn(),
      removeRepository: jest.fn(),
    };
    return render(<SelectRepositoryList {...{ ...defaultProps, ...props }} />);
  };

  it('リポジトリの一覧を表示する', () => {
    const repositories = [
      {
        nameWithOwner: 'test/testA',
        url: 'https://github.com/test/testA',
      },
      {
        nameWithOwner: 'test/testB',
        url: 'https://github.com/test/testB',
      },
    ];
    renderSelectRepositoryList({ repositories });

    for (const repository of repositories) {
      expect(screen.queryByText(repository.nameWithOwner)).toBeInTheDocument();
    }
  });

  describe('リポジトリの追加', () => {
    it('設定に未登録のリポジトリの場合は追加アイコンを表示する', () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      renderSelectRepositoryList({ repositories, subscribedRepositories: [] });

      const addRepositoryButton = screen.getByRole('button', {
        name: 'リポジトリを設定に追加する',
      });
      const icon = queryByRole(addRepositoryButton, 'img', { hidden: true });

      expect(icon).toBeInTheDocument();
    });

    it('追加アイコンをクリックすることでリポジトリを設定に追加するコールバック関数が呼ばれる', async () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      const addRepositoryMock = jest.fn();
      renderSelectRepositoryList({
        repositories,
        subscribedRepositories: [],
        addRepository: addRepositoryMock,
      });

      const addRepositoryButton = screen.getByRole('button', {
        name: 'リポジトリを設定に追加する',
      });
      await user.click(addRepositoryButton);

      expect(addRepositoryMock).toBeCalledWith(repositories[0].nameWithOwner);
    });
  });

  describe('リポジトリの削除', () => {
    it('設定に登録済みのリポジトリは追加済みのアイコンを表示する', () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      renderSelectRepositoryList({
        repositories,
        subscribedRepositories: ['test/testA'],
      });

      const removeRepositoryButton = screen.getByRole('button', {
        name: '設定からリポジトリを削除する',
      });
      const icon = queryByRole(removeRepositoryButton, 'img', { hidden: true });

      expect(icon).toBeInTheDocument();
    });

    it('追加済みのアイコンをクリックすることでリポジトリを設定から削除するコールバック関数が呼ばれる', async () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      const removeRepositoryMock = jest.fn();
      renderSelectRepositoryList({
        repositories,
        subscribedRepositories: ['test/testA'],
        removeRepository: removeRepositoryMock,
      });

      const removeRepositoryButton = screen.getByRole('button', {
        name: '設定からリポジトリを削除する',
      });
      await user.click(removeRepositoryButton);

      expect(removeRepositoryMock).toBeCalledWith(
        repositories[0].nameWithOwner
      );
    });
  });
});
