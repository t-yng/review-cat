import React from 'react';
import { Button } from '../Button';
import { AppIcon } from '../AppIcon';
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
        <Button onClick={handleClick}>Login To GitHub</Button>
      </div>
    </div>
  );
};
