import React from 'react';
import { Button } from '../Button';
import { AppIcon } from '../AppIcon';
import { rootStyle, buttonContainerStyle } from './styles.css';
import { useAtom } from 'jotai';
import { signInAtom } from '../../jotai/auth';
import { useNavigate } from 'react-router-dom';

export const LoginContent: React.FC = () => {
  const navigate = useNavigate();
  const [, signIn] = useAtom(signInAtom);

  const handleClick = () => {
    signIn(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className={rootStyle}>
      <AppIcon />
      <div className={buttonContainerStyle}>
        <Button onClick={handleClick}>Login To GitHub</Button>
      </div>
    </div>
  );
};
