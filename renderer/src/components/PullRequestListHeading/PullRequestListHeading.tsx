import React from 'react';
import { styles } from './styles.css';

interface Props {
  as?: React.ElementType;
  text: string;
}

export const PullRequestListHeading: React.FC<Props> = ({
  as: Heading = 'h1',
  text,
}) => {
  return <Heading className={styles.rootStyle}>{text}</Heading>;
};
