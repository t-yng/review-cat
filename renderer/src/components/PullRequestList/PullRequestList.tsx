import React, { FC } from 'react';
import { PullRequest } from 'renderer/src/models';

type Props = {
  pullRequests: PullRequest[];
};

export const PullRequestList: FC<Props> = ({ pullRequests }: Props) => {
  return (
    <ul>
      {pullRequests.map((pr, i) => (
        <li key={pr.title ?? i}>
          <h1>{`${pr.repository.nameWithOwner}: ${pr.title}(${pr.status})`}</h1>
        </li>
      ))}
    </ul>
  );
};
