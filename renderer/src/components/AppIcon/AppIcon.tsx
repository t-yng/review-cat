import React from 'react';
import { appIconStyle, appIconSVGStyle } from './styles.css';

export const AppIcon: React.FC = () => {
  return (
    <div className={`${appIconStyle}`}>
      <svg
        className={`${appIconSVGStyle}`}
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <title>review-cat</title>
        <use xlinkHref="#review-cat" />
      </svg>
    </div>
  );
};
