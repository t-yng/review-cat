import React from 'react';
import { BaseLayout } from '../../layouts/BaseLayout';
import { AppIcon } from '../../components/AppIcon';
import { LoginButton } from '../../components/LoginButton';

export const LoginPage = () => {
  return (
    <BaseLayout>
      <AppIcon />
      <LoginButton />
    </BaseLayout>
  );
};
