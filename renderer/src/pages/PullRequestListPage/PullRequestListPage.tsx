import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { PullRequestListContainer } from '../../containers/PullRequestListContainer/PullRequestListContainer';
import { SearchPullRequestsQuery } from '../../graphql/queries';
import { buildSearchPullRequestsQuery } from '../../graphql/queries/builder';
import { useSettings } from '../../hooks';
import { loginUserAtom } from '../../jotai';
import { BaseLayout } from '../../layouts/BaseLayout';
import { SearchPullRequestsQuery as SearchPullRequestsQueryType } from '../../graphql/queries/__generated__/SearchPullRequestsQuery.graphql';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

export const PullRequestListPage: FC = () => {
  // TODO: ユーザー情報の取得周りは AppStateProvider, useAppState を作成してそちらに寄せる
  // ここでユーザー情報の更新をすると親コンポーネントで Suspense でラップする必要がありナビゲーション含めてフォールバックされる
  const environment = useRelayEnvironment();
  const [user] = useAtom(loginUserAtom);
  const { settings } = useSettings();

  const loadPullRequests = useCallback(() => {
    return loadQuery<SearchPullRequestsQueryType>(
      environment,
      SearchPullRequestsQuery,
      {
        // REFACTOR: user のnullチェックが不要な形に変更できない？
        login_user_name: user?.name ?? '',
        search_query: buildSearchPullRequestsQuery(
          settings.subscribedRepositories
        ),
      },
      { fetchPolicy: 'store-and-network' }
    );
  }, [environment, user?.name, settings]);

  const [preloadedQuery, setPreloadedQuery] = useState(() => {
    return loadPullRequests();
  });

  useEffect(() => {
    const timerId = setInterval(() => {
      setPreloadedQuery(loadPullRequests());
    }, FETCH_PULL_REQUESTS_INTERVAL);

    return () => {
      clearInterval(timerId);
    };
  }, [setPreloadedQuery, loadPullRequests]);

  return (
    <BaseLayout>
      <Suspense fallback="Loading...">
        <PullRequestListContainer preloadedQuery={preloadedQuery} />
      </Suspense>
    </BaseLayout>
  );
};
