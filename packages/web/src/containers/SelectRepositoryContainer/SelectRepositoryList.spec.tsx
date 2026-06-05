import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      addRepository: vi.fn(),
      removeRepository: vi.fn(),
    };
    return render(<SelectRepositoryList {...{ ...defaultProps, ...props }} />);
  };

  it('Displays the repository list', () => {
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

  describe('Repository addition', () => {
    it('Displays add icon for repositories not registered in settings', () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      renderSelectRepositoryList({ repositories, subscribedRepositories: [] });

      const addRepositoryButton = screen.getByRole('button', {
        name: 'Add repository to settings',
      });
      const icon = addRepositoryButton.querySelector('svg');

      expect(icon).toBeInTheDocument();
    });

    it('Callback function to add repository to settings is called when add icon is clicked', async () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      const addRepositoryMock = vi.fn();
      renderSelectRepositoryList({
        repositories,
        subscribedRepositories: [],
        addRepository: addRepositoryMock,
      });

      const addRepositoryButton = screen.getByRole('button', {
        name: 'Add repository to settings',
      });
      await user.click(addRepositoryButton);

      expect(addRepositoryMock).toHaveBeenCalledWith(
        repositories[0].nameWithOwner
      );
    });
  });

  describe('Repository deletion', () => {
    it('Displays already-added icon for repositories registered in settings', () => {
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
        name: 'Remove repository from settings',
      });
      const icon = removeRepositoryButton.querySelector('svg');

      expect(icon).toBeInTheDocument();
    });

    it('Callback function to remove repository from settings is called when the already-added icon is clicked', async () => {
      const repositories = [
        {
          nameWithOwner: 'test/testA',
          url: '',
        },
      ];
      const removeRepositoryMock = vi.fn();
      renderSelectRepositoryList({
        repositories,
        subscribedRepositories: ['test/testA'],
        removeRepository: removeRepositoryMock,
      });

      const removeRepositoryButton = screen.getByRole('button', {
        name: 'Remove repository from settings',
      });
      await user.click(removeRepositoryButton);

      expect(removeRepositoryMock).toHaveBeenCalledWith(
        repositories[0].nameWithOwner
      );
    });
  });
});
