import { useEffect, FC, PropsWithChildren } from 'react';
import { useAuth, useWatchPullRequests } from '@/stores';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { startPolling, stopPolling } = useWatchPullRequests();

  useEffect(() => {
    if (isLoggedIn) {
      startPolling(FETCH_PULL_REQUESTS_INTERVAL);
    }

    return () => {
      stopPolling();
    };
  }, [isLoggedIn, startPolling, stopPolling]);

  return <>{children}</>;
};
