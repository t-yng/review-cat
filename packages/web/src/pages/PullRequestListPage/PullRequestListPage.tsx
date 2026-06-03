import { FC, Suspense } from 'react';
import { PullRequestListContainer } from '../../containers/PullRequestListContainer/PullRequestListContainer';
import { BaseLayout } from '../../layouts/BaseLayout';
import { Loading } from '../../components/Loading';

export const PullRequestListPage: FC = () => {
  return (
    <BaseLayout>
      <Suspense
        fallback={
          <div
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loading />
          </div>
        }
      >
        <PullRequestListContainer />
      </Suspense>
    </BaseLayout>
  );
};
