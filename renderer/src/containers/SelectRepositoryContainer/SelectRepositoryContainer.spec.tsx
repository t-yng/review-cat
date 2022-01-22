import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectRepositoryContainer } from './SelectRepositoryContainer';
import { Repository } from '../../hooks/useSearchRepository';

const repositories: Repository[] = [
  {
    nameWithOwner: 'test/testA',
    url: 'https://github.com/test/testA',
  },
  {
    nameWithOwner: 'test/testB',
    url: 'https://github.com/test/testB',
  },
];

vi.mock('../../components/SearchRepository', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SearchRepository: (props: any) => {
    return (
      <div>
        <button onClick={() => props.onSearch(repositories)}>検索</button>
        {props.children}
      </div>
    );
  },
}));

describe('SelectRepositoryContainer', () => {
  const renderSelectRepositoryContainer = () => {
    return render(<SelectRepositoryContainer />);
  };

  it('検索結果のリポジトリ一覧を表示する', () => {
    renderSelectRepositoryContainer();
    const button = screen.getByText('検索');
    userEvent.click(button);

    for (const repository of repositories) {
      expect(screen.queryByText(repository.nameWithOwner)).toBeInTheDocument();
    }
  });
});
