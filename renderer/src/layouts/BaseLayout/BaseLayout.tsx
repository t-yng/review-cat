import React from 'react';
import { baseLayoutStyle } from './styles.css';

interface Props {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<Props> = (props: Props) => {
  return (
    <main className={`${baseLayoutStyle}`}>
      <nav>nav</nav>
      <div>{props.children}</div>
    </main>
  );
};
