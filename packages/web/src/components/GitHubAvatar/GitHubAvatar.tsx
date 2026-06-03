import React, { memo } from 'react';
import { rootStyle } from './styles.css';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const GitHubAvatar: React.FC<Props> = memo(
  ({ alt = '', className = '', ...others }) => {
    // TODO: GitHub avatar images can be size-adjusted via parameter (`s={size}`) — would like to utilize this properly.
    return (
      <img className={`${rootStyle} ${className}`} alt={alt} {...others} />
    );
  }
);
