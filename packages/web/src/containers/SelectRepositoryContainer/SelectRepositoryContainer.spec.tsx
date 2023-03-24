import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Repository } from '@/hooks/useSearchRepository';
import { SelectRepositoryContainer } from './SelectRepositoryContainer';
import { customRender } from '@test/helpers/render';

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

jest.mock('../../components/SearchRepository', () => ({
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
  const user = userEvent.setup();
  const renderSelectRepositoryContainer = () => {
    return customRender(<SelectRepositoryContainer />);
  };

  it('検索結果のリポジトリ一覧を表示する', async () => {
    renderSelectRepositoryContainer();
    const button = screen.getByText('検索');

    await act(async () => await user.click(button));

    for (const repository of repositories) {
      expect(screen.queryByText(repository.nameWithOwner)).toBeInTheDocument();
    }
  });
});
