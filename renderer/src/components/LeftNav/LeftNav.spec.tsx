import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeftNav } from '.';
import { MemoryRouter } from 'react-router';
import { usePullRequests } from '../../hooks';
import { PullRequest } from '../../models';

jest.mock('../../hooks/usePullRequests');
const usePullRequestsMock = usePullRequests as jest.MockedFunction<
  typeof usePullRequests
>;

const defaultPullRequests = [
  {
    status: 'requestedReview',
  },
  {
    status: 'requestedReview',
  },
  {
    status: 'reviewing',
  },
  {
    status: 'approved',
  },
];

describe('LeftNav', () => {
  describe('GitPullRequestIcon', () => {
    beforeEach(() => {
      usePullRequestsMock.mockReturnValue({
        pullRequests: defaultPullRequests as PullRequest[],
        firstLoading: false,
      });
    });

    afterEach(() => {
      usePullRequestsMock.mockReset();
    });

    const renderLeftNav = () => {
      return render(
        <MemoryRouter>
          <LeftNav />
        </MemoryRouter>
      );
    };

    it('プルリク一覧へのリンクとなっている', () => {
      renderLeftNav();
      const pullRequestIcon = screen.getByLabelText('プルリクエスト一覧へ移動');
      const link = pullRequestIcon.closest('a');

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('レビューリクエストのプルリク数を表示する', () => {
      renderLeftNav();

      const badge = screen.getByTestId('pr-count-badge');
      expect(badge).toHaveTextContent('2');
    });

    it('リクエスト待ちのプルリクが0件の場合はバッジを表示しない', () => {
      usePullRequestsMock.mockReturnValue({
        pullRequests: [],
        firstLoading: false,
      });
      renderLeftNav();

      const badge = screen.queryByTestId('pr-count-badge');
      expect(badge).not.toBeInTheDocument();
    });
  });
});
