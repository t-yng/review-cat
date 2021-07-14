import React from 'react';
import { useAtom } from 'jotai';
import { signInAtom } from '../jotai/auth';

export const LoginPage = () => {
  const [, signIn] = useAtom(signInAtom);

  return (
    <div>
      <button onClick={signIn}>ログイン</button>
    </div>
  );
};
