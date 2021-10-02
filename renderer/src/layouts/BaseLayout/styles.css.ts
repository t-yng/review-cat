import { style } from '@vanilla-extract/css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  display: 'grid',
  gridTemplateColumns: `${space(8)} 1fr`,
  gridTemplateRows: '1fr',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
});

export const navContainerStyle = style({
  position: 'sticky',
  top: '0',
  left: '0',
  height: '100vh',
  zIndex: 100,
});
