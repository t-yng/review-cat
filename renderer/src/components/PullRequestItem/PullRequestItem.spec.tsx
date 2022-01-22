import React from 'react';
import { render, screen } from '@testing-library/react';
import { instance, mock, when } from 'ts-mockito';
import { PullRequestItem } from '.';
import { PullRequest, User } from '../../models';
import { testEach } from '../../../../test/helpers/testEach';

describe('PullRequestItem', () => {
  describe('link', () => {
    it('リンク先がプルリクエストのURLになっている', () => {
      const authorMock = mock<User>();
      when(authorMock.avatarUrl).thenReturn(
        'https://example.com/images/avatar.jpg'
      );
      when(authorMock.name).thenReturn('test');
      const pullRequestMock = mock<PullRequest>();
      when(pullRequestMock.url).thenReturn(
        'https://github.com/higeOhige/review-cat/pull/84'
      );
      when(pullRequestMock.author).thenReturn(instance(authorMock));
      when(pullRequestMock.title).thenReturn('test');

      const pullRequest = instance(pullRequestMock);
      render(<PullRequestItem pullRequest={pullRequest} />);

      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('href', pullRequest.url);
    });
  });

  describe('status', () => {
    testEach([
      {
        status: 'requestedReview' as const,
        expected: 'レビュー待ち',
      },
      {
        status: 'reviewing' as const,
        expected: 'レビュー中',
      },
      {
        status: 'approved' as const,
        expected: '承認済',
      },
    ])('$status のときに $expected を表示する', ({ status, expected }: any) => {
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
      const pullRequest = instance(pullRequestMock);
      render(<PullRequestItem pullRequest={pullRequest} />);
      const statusLabel = screen.queryByText(expected);
      expect(statusLabel).toBeInTheDocument();
    });
  });
});
