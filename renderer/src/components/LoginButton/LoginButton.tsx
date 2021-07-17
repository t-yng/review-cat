import React from 'react';
import { themeFocusVisibleOutline } from '../../theme.css';
import { buttonStyle } from './styles.css';
import { useAtom } from 'jotai';
import { signInAtom } from '../../jotai/auth';

export const LoginButton: React.FC = () => {
  const [, signIn] = useAtom(signInAtom);

  return (
    <button
      className={`${buttonStyle} ${themeFocusVisibleOutline}`}
      type="button"
      onClick={signIn}
    >
      Login To GitHub
    </button>
  );
};
