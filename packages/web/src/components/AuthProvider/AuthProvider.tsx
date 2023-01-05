import React from 'react';
import { useAtom } from 'jotai';
import { FC, Fragment, ReactNode, useEffect } from 'react';
import { loginUserAtom } from '../../jotai';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, autoSignIn] = useAtom(loginUserAtom);

  useEffect(() => {
    if (user == null) {
      autoSignIn();
    }
  }, [user, autoSignIn]);

  return <Fragment>{children}</Fragment>;
};
