import React from 'react';
import { BaseLayout } from '../../layouts/BaseLayout';
import { AppIcon } from '../../components/AppIcon';
import { useAtom } from 'jotai';
import { signInAtom } from '../../jotai/auth';

export const LoginPage = () => {
  const [, signIn] = useAtom(signInAtom);

  return (
    <BaseLayout>
      <AppIcon />
      <button onClick={signIn}>ログイン</button>
    </BaseLayout>
  );
};
