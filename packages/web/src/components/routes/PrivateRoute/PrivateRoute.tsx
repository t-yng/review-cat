import { FC, PropsWithChildren, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Suspense fallback="Loading...">{children}</Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};
