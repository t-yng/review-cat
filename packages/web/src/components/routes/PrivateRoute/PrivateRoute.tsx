import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores';
import { Loading } from '@/components/Loading';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, userInitialized } = useAuth();

  if (!userInitialized) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading />
      </div>
    );
  }

  return userInitialized && user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
