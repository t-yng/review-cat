import React from 'react';
import { render, screen } from '@testing-library/react';
import { instance, mock, when } from 'ts-mockito';
import { RepositorySection } from '.';
import {
  PullRequest,
  PullRequestStatus,
  RepositoryData,
  User,
} from '../../models';

describe('RepositorySection', () => {
  const createPullRequest = ({ status }: { status: PullRequestStatus }) => {
    const authorMock = mock<User>();
    when(authorMock.avatarUrl).thenReturn(
      'https://example.com/images/avatar.jpg'
    );
    when(authorMock.name).thenReturn('test');
    const pullRequestMock = mock<PullRequest>();
    when(pullRequestMock.status).thenReturn(status);
    when(pullRequestMock.url).thenReturn(
      'https://github.com/higeOhige/review-cat/pull/84'
    );
    when(pullRequestMock.author).thenReturn(instance(authorMock));
    when(pullRequestMock.title).thenReturn('test');

    return instance(pullRequestMock);
  };

  describe('sortPullRequests', () => {
    it('ステータスに応じてプルリクの一覧がソートをする', () => {
      const pullRequests = [
        'approved' as const,
        'requestedReview' as const,
        'reviewing' as const,
      ].map((status) => createPullRequest({ status }));

      const repositoryMock = mock<RepositoryData>();
      when(repositoryMock.pullRequests).thenReturn(pullRequests);
      const repository = instance(repositoryMock);

      render(<RepositorySection repository={repository} />);
      const pullRequestItems = screen.getAllByRole('listitem');

      expect(pullRequestItems[0]).toHaveTextContent('requestedReview');
      expect(pullRequestItems[1]).toHaveTextContent('reviewing');
      expect(pullRequestItems[2]).toHaveTextContent('approved');
    });
  });
});
