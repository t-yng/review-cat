import { screen } from '@testing-library/react';
import { vi, type MockedFunction } from 'vitest';
import { usePullRequests } from '@/stores';
import { PullRequest, pullRequestStatus } from '@/models';
import { LeftNav } from '.';
import { customRender } from '@test/helpers/render';

vi.mock('@/stores/pullRequest/usePullRequests');
const usePullRequestsMock = usePullRequests as MockedFunction<
  typeof usePullRequests
>;

const defaultPullRequests = [
  {
    status: pullRequestStatus.waitingReview,
  },
  {
    status: pullRequestStatus.waitingReview,
  },
  {
    status: pullRequestStatus.reviewed,
  },
  {
    status: pullRequestStatus.approved,
  },
];

describe('LeftNav', () => {
  describe('GitPullRequestIcon', () => {
    beforeEach(() => {
      usePullRequestsMock.mockReturnValue({
        pullRequests: defaultPullRequests as PullRequest[],
      });
    });

    afterEach(() => {
      usePullRequestsMock.mockReset();
    });

    const renderLeftNav = () => {
      return customRender(<LeftNav />);
    };

    it('Is a link to the pull request list', () => {
      renderLeftNav();
      const pullRequestIcon = screen.getByLabelText('Go to pull request list');
      const link = pullRequestIcon.closest('a');

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('Displays the number of review request pull requests', () => {
      renderLeftNav();

      const badge = screen.getByTestId('pr-count-badge');
      expect(badge).toHaveTextContent('2');
    });

    it('Does not display badge when there are 0 pending request pull requests', () => {
      usePullRequestsMock.mockReturnValue({
        pullRequests: [],
      });
      renderLeftNav();

      const badge = screen.queryByTestId('pr-count-badge');
      expect(badge).not.toBeInTheDocument();
    });
  });
});
