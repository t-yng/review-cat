import React from 'react';
import { themeFocusVisibleOutline } from '../../theme.css';
import { buttonStyle } from './styles.css';

type LoginButtonProps = {
  onClick: () => void;
};

export const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button
      className={`${buttonStyle} ${themeFocusVisibleOutline}`}
      type="button"
      onClick={onClick}
    >
      Login To GitHub
    </button>
  );
};
