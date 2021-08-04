import React, { FC } from 'react';
import { PullRequest } from 'renderer/src/models';
import { RepositorySection } from '../RepositorySection';

type Props = {
  pullRequests: PullRequest[];
};

export const PullRequestList: FC<Props> = ({ pullRequests }: Props) => {
  return (
    <React.Fragment>
      {pullRequests.map((pr, i) => (
        <RepositorySection pullRequest={pr} key={pr.title ?? i} />
      ))}
    </React.Fragment>
  );
};
