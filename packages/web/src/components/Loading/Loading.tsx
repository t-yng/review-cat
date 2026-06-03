import { FC } from 'react';
import { spinnerStyle } from './style.css';

export const Loading: FC = () => {
  return <div className={spinnerStyle} role="status" aria-label="Loading" />;
};
