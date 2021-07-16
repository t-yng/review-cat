import React from 'react';
import { BaseLayout } from '../layouts/BaseLayout';
import { useAtom } from 'jotai';
import { signInAtom } from '../jotai/auth';

export const LoginPage = () => {
  const [, signIn] = useAtom(signInAtom);

  return (
    <BaseLayout>
      <button onClick={signIn}>ログイン</button>
    </BaseLayout>
  );
};
