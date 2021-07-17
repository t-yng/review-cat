import React from 'react';
import { AppIcon } from '../AppIcon';
import { navStyle } from './styles.css';

export const LeftNav: React.FC = () => {
  return (
    <nav className={`${navStyle}`}>
      <h1>
        <AppIcon />
      </h1>
    </nav>
  );
};
