import React from 'react';
import { AppIcon } from '../AppIcon';
import { LoginButton } from '../LoginButton';
import {
  rootStyle,
  iconContainerStyle,
  buttonContainerStyle,
} from './styles.css';

export const LoginContent: React.FC = () => {
  return (
    <div className={`${rootStyle}`}>
      <div className={`${iconContainerStyle}`}>
        <AppIcon />
      </div>
      <div className={`${buttonContainerStyle}`}>
        <LoginButton />
      </div>
    </div>
  );
};
