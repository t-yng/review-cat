import { useAtom } from 'jotai';
import React, { FC, Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { PullRequestListContainer } from '../../containers/PullRequestListContainer/PullRequestListContainer';
import { SearchPullRequestsQuery } from '../../graphql/queries';
import { buildSearchPullRequestsQuery } from '../../graphql/queries/builder';
import { useSettings } from '../../hooks';
import { loginUserAtom } from '../../jotai';
import { BaseLayout } from '../../layouts/BaseLayout';

export const PullRequestListPage: FC = () => {
  // TODO: ユーザー情報の取得周りは AppStateProvider, useAppState を作成してそちらに寄せる
  // ここでユーザー情報の更新をすると親コンポーネントで Suspense でラップする必要がありナビゲーション含めてフォールバックされる
  const environment = useRelayEnvironment();
  const [user] = useAtom(loginUserAtom);
  const { settings } = useSettings();

  // REFACTOR: user のnullチェックが不要な形に変更できない？
  return (
    <BaseLayout>
      <Suspense fallback="Loading...">
        <PullRequestListContainer
          preloadedQuery={loadQuery(environment, SearchPullRequestsQuery, {
            login_user_name: user?.name ?? '',
            search_query: buildSearchPullRequestsQuery(
              settings.subscribedRepositories
            ),
          })}
        />
      </Suspense>
    </BaseLayout>
  );
};
