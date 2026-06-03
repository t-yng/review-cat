import { useEffect, FC, PropsWithChildren } from 'react';
import { useAuth, useWatchPullRequests } from '@/stores';

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const { userInitialized, autoSignIn, user } = useAuth();
  const { startPolling, stopPolling } = useWatchPullRequests();

  useEffect(() => {
    if (!userInitialized) {
      autoSignIn();
    }
  }, [autoSignIn, userInitialized]);

  useEffect(() => {
    if (user) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [user, startPolling, stopPolling]);

  return <>{children}</>;
};
