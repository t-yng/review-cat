import { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { rootStyle, sizeStyles } from './style.css';
import { themeFocusVisibleOutline } from '../../theme.css';

type ButtonSize = 'md' | 'lg';

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  size = 'md',
  ...others
}) => {
  return (
    <button
      className={classNames(
        rootStyle,
        sizeStyles[size],
        themeFocusVisibleOutline,
        className
      )}
      {...others}
    >
      {children}
    </button>
  );
};
