import React from 'react';
import { render, screen } from '@testing-library/react';
import { instance, mock, when } from 'ts-mockito';
import { RepositorySection } from '.';
import {
  PullRequest,
  PullRequestStatus,
  pullRequestStatus,
  RepositoryData,
  User,
} from '../../models';

describe('RepositorySection', () => {
  const createPullRequest = ({
    status,
    url,
  }: {
    status: PullRequestStatus;
    url: string;
  }) => {
    const authorMock = mock<User>();
    when(authorMock.avatarUrl).thenReturn(
      'https://example.com/images/avatar.jpg'
    );
    when(authorMock.name).thenReturn('test');
    const pullRequestMock = mock<PullRequest>();
    when(pullRequestMock.status).thenReturn(status);
    when(pullRequestMock.url).thenReturn(url);
    when(pullRequestMock.author).thenReturn(instance(authorMock));
    when(pullRequestMock.title).thenReturn('test');

    return instance(pullRequestMock);
  };

  describe('sortPullRequests', () => {
    it('ステータスに応じてプルリクの一覧をソートする', () => {
      const pullRequests = [
        pullRequestStatus.approved,
        pullRequestStatus.waitingReview,
        pullRequestStatus.reviewed,
      ].map((status, i) => {
        const url = `https://github.com/higeOhige/review-cat/pull/${i}`;
        return createPullRequest({ status, url });
      });

      const repositoryMock = mock<RepositoryData>();
      when(repositoryMock.pullRequests).thenReturn(pullRequests);
      const repository = instance(repositoryMock);

      render(<RepositorySection repository={repository} />);
      const pullRequestItems = screen.getAllByRole('listitem');

      expect(pullRequestItems[0]).toHaveTextContent('レビュー待ち');
      expect(pullRequestItems[1]).toHaveTextContent('レビュー済み');
      expect(pullRequestItems[2]).toHaveTextContent('承認済み');
    });
  });
});
