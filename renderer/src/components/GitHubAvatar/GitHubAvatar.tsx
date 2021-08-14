import React from 'react';
import { rootStyle } from './styles.css';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const GitHubAvatar: React.FC<Props> = ({ alt = '', ...others }) => {
  // TODO: GitHub のアバター画像、パラメータ(`s={size}`)でサイズ調整できるのでうまいこと利用したい。
  return <img className={rootStyle} alt={alt} {...others} />;
};