import React, { Suspense } from 'react';
import { BaseLayout } from '../../layouts/BaseLayout';
import { LoginContent } from '../../components/LoginContent';
import { contentContainerStyle } from './styles.css';

export const LoginPage = () => {
  return (
    <BaseLayout>
      <div className={`${contentContainerStyle}`}>
        <Suspense fallback="Loading...">
          <LoginContent />
        </Suspense>
      </div>
    </BaseLayout>
  );
};
