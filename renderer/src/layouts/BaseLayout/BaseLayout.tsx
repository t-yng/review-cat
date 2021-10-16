import React from 'react';
import { LeftNav } from '../../components/LeftNav';
import { rootStyle, navContainerStyle } from './styles.css';

interface Props {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<Props> = (props: Props) => {
  return (
    <main className={rootStyle}>
      <div className={navContainerStyle}>
        <LeftNav />
      </div>
      <div>{props.children}</div>
    </main>
  );
};
