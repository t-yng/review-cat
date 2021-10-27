import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeftNav } from '.';
import { MemoryRouter } from 'react-router';

const pullRequests = [
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

jest.mock('../../hooks/usePullRequests', () => ({
  usePullRequests() {
    return {
      pullRequests: pullRequests,
    };
  },
}));

describe('LeftNav', () => {
  describe('GitPullRequestIcon', () => {
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
      // 描画
      renderLeftNav();
      // ステータスバッジの取得
      const badge = screen.getByTestId('pr-count-badge');
      // プルリク数が表示されている
      expect(badge).toHaveTextContent('2');
    });
  });
});
