import { FC, PropsWithChildren, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, userInitialized } = useAuth();

  if (!userInitialized) {
    return <div>Loading...</div>;
  }

  return userInitialized && user ? (
    <Suspense fallback="Loading...">{children}</Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};
