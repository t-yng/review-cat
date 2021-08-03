import React, { FC } from 'react';
import { PullRequest } from 'renderer/src/models';
import { PullRequestListItem } from '../PullRequestListItem';

type Props = {
  pullRequests: PullRequest[];
};

export const PullRequestList: FC<Props> = ({ pullRequests }: Props) => {
  return (
    <ul>
      {pullRequests.map((pr, i) => (
        <li key={pr.title ?? i}>
          <h1>{pr.repository.nameWithOwner}</h1>
          <PullRequestListItem {...pr} />
        </li>
      ))}
    </ul>
  );
};
