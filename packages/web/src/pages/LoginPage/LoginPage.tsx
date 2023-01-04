import React, { Suspense } from 'react';
import { LoginContent } from '../../components/LoginContent';
import { rootStyle } from './styles.css';

export const LoginPage = () => {
  return (
    <div className={rootStyle}>
      <Suspense fallback="Loading...">
        <LoginContent />
      </Suspense>
    </div>
  );
};
