import { screen } from '@testing-library/react';
import { PullRequestStatus, pullRequestStatus } from '@/models';
import { PullRequestListContainer } from './PullRequestListContainer';
import { useSetting } from '@/stores';
import { createRepository } from '@test/mocks/factory/repository';
import { createPullRequest } from '@test/mocks/factory/pullRequest';
import { createSetting } from '@test/mocks/factory/setting';
import { customRender } from '@test/helpers/render';

jest.mock('@/stores/setting/useSetting', () => {
  return {
    useSetting: jest.fn(),
  };
});
const useSettingMock = useSetting as jest.MockedFunction<typeof useSetting>;

jest.mock('@/hooks/usePullRequests', () => {
  return {
    usePullRequests() {
      const pullRequests = [
        pullRequestStatus.waitingReview,
        pullRequestStatus.reviewed,
        pullRequestStatus.approved,
      ].map((status: PullRequestStatus, index) => {
        const pullRequest = createPullRequest({
          status: status,
          repository: createRepository({ nameWithOwner: 'test' }),
          url: `https://github.com/t-yng/review-cat/pull/${index}`,
        });

        return pullRequest;
      });

      return {
        pullRequests: pullRequests,
      };
    },
  };
});

describe('PullRequestListContainer', () => {
  describe('filterPullRequests', () => {
    it.each([
      {
        statusText: 'レビュー待ち',
        showsRequestedReviewPR: false,
        showsInReviewPR: true,
        showsApprovedPR: true,
      },
      {
        statusText: 'レビュー済み',
        showsRequestedReviewPR: true,
        showsInReviewPR: false,
        showsApprovedPR: true,
      },
      {
        statusText: '承認済み',
        showsRequestedReviewPR: true,
        showsInReviewPR: true,
        showsApprovedPR: false,
      },
    ])(
      '$statusText の表示をOFFにした時にプルリクスト一覧から除外する',
      (cases) => {
        const setting = createSetting({
          showsRequestedReviewPR: cases.showsRequestedReviewPR,
          showsInReviewPR: cases.showsInReviewPR,
          showsApprovedPR: cases.showsApprovedPR,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useSettingMock.mockReturnValue({ setting: setting } as any);

        customRender(<PullRequestListContainer />);

        const waitingReviewPullRequest = screen.queryByText('レビュー待ち');
        const reviewedPullRequest = screen.queryByText('レビュー済み');
        const approvedPullRequest = screen.queryByText('承認済み');

        if (cases.showsRequestedReviewPR) {
          expect(waitingReviewPullRequest).toBeInTheDocument();
        } else {
          expect(waitingReviewPullRequest).not.toBeInTheDocument();
        }

        if (cases.showsInReviewPR) {
          expect(reviewedPullRequest).toBeInTheDocument();
        } else {
          expect(reviewedPullRequest).not.toBeInTheDocument();
        }

        if (cases.showsApprovedPR) {
          expect(approvedPullRequest).toBeInTheDocument();
        } else {
          expect(approvedPullRequest).not.toBeInTheDocument();
        }
      }
    );
  });
});
