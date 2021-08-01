import React from 'react';
import { AppIcon } from '../AppIcon';
import { LoginButton } from '../LoginButton';
import {
  rootStyle,
  iconContainerStyle,
  buttonContainerStyle,
} from './styles.css';
import { useAtom } from 'jotai';
import { signInAtom } from '../../jotai/auth';
import { useHistory } from 'react-router-dom';

export const LoginContent: React.FC = () => {
  const history = useHistory();
  const [, signIn] = useAtom(signInAtom);

  const handleClick = () => {
    signIn(() => {
      history.replace('/');
    });
  };

  return (
    <div className={`${rootStyle}`}>
      <div className={`${iconContainerStyle}`}>
        <AppIcon />
      </div>
      <div className={`${buttonContainerStyle}`}>
        <LoginButton onClick={handleClick} />
      </div>
    </div>
  );
};
