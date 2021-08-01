import React, { FC, ReactNode, Suspense } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isLoggedInAtom } from '../../../jotai';
import { AuthProvider } from '../../AuthProvider';

type PrivateRouteProps = RouteProps & {
  children?: ReactNode;
};

export const PrivateRoute: FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <Route {...rest}>
      {isLoggedIn ? (
        <Suspense fallback="Loading...">
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  );
};
