import { FC, PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { autoSignIn, user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    autoSignIn().finally(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return initialized && user ? (
    <Suspense fallback="Loading...">{children}</Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};
