import { FC, PropsWithChildren, Suspense } from 'react';
import { Route, RouteProps, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isLoggedInAtom } from '../../../jotai';
import { AuthProvider } from '../../AuthProvider';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return isLoggedIn ? (
    <Suspense fallback="Loading...">
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};
