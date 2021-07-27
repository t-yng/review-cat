import { useAtom } from 'jotai';
import React, { FC, Suspense, useEffect } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { PullRequestListContainer } from '../../containers/PullRequestListContainer/PullRequestListContainer';
import { SearchPullRequestsQuery } from '../../graphql/queries';
import { buildSearchPullRequestsQuery } from '../../graphql/queries/builder';
import { loginUserAtom } from '../../jotai';
import { BaseLayout } from '../../layouts/BaseLayout';

export const PullRequestListPage: FC = () => {
  // TODO: ユーザー情報の取得周りは AppStateProvider, useAppState を作成してそちらに寄せる
  // ここでユーザー情報の更新をすると親コンポーネントで Suspense でラップする必要がありナビゲーション含めてフォールバックされる
  const environment = useRelayEnvironment();
  const [user, autoSignIn] = useAtom(loginUserAtom);

  useEffect(() => {
    if (user == null) {
      autoSignIn();
    }
  }, [user]);

  // REFACTOR: user のnullチェックが不要な形に変更できない？
  return (
    <BaseLayout>
      {user != null ? (
        <Suspense fallback="Loading...">
          <PullRequestListContainer
            preloadedQuery={loadQuery(environment, SearchPullRequestsQuery, {
              login_user_name: user.name,
              // TODO: 購読するリポジトリの一覧を設定から取得
              search_query: buildSearchPullRequestsQuery([
                't-yng/blog',
                'higeOhige/review-cat',
              ]),
            })}
          />
        </Suspense>
      ) : (
        <span>Loading...</span>
      )}
    </BaseLayout>
  );
};
