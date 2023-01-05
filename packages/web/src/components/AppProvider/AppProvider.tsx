import React, { useEffect, FC } from 'react';
import { useWatchPullRequests } from '../../hooks';

// 頻度が多いと Github GraphQL API のレート制限に影響するので、投げるクエリのスコアを計算して調整してください。
// @see: https://docs.github.com/ja/graphql/overview/resource-limitations
const FETCH_PULL_REQUESTS_INTERVAL = 60 * 1000; // ms

export const AppProvider: FC = ({ children }) => {
  const { startPolling, stopPolling } = useWatchPullRequests();

  useEffect(() => {
    startPolling(FETCH_PULL_REQUESTS_INTERVAL);

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return <>{children}</>;
};
