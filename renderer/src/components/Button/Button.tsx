import React, { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { rootStyle } from './style.css';
import { themeFocusVisibleOutline } from '../../theme.css';

export const Button: FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...others
}) => {
  return (
    <button
      className={classNames(rootStyle, themeFocusVisibleOutline, className)}
      {...others}
    >
      {children}
    </button>
  );
};
