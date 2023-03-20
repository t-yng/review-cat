import React, { memo } from 'react';
import { rootStyle } from './styles.css';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const GitHubAvatar: React.FC<Props> = memo(
  ({ alt = '', className = '', ...others }) => {
    // TODO: GitHub のアバター画像、パラメータ(`s={size}`)でサイズ調整できるのでうまいこと利用したい。
    return (
      <img className={`${rootStyle} ${className}`} alt={alt} {...others} />
    );
  }
);
