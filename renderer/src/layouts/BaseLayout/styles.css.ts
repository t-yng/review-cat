import { style } from '@vanilla-extract/css';

export const baseLayoutStyle = style({
  display: 'grid',
  gridTemplateColumns: '64px 1fr',
  gridTemplateRows: '1fr',
  width: '100%',
  height: '100vh',
  backgroundColor: '#fff',
});
