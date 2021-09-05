import React, { FC } from 'react';
import { PullRequestListContainer } from '../../containers/PullRequestListContainer/PullRequestListContainer';
import { BaseLayout } from '../../layouts/BaseLayout';

export const PullRequestListPage: FC = () => {
  return (
    <BaseLayout>
      <PullRequestListContainer />
    </BaseLayout>
  );
};
