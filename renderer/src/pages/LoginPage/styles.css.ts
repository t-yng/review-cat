import { style } from '@vanilla-extract/css';
import { space } from '../../themeStyleHelper';

export const contentContainerStyle = style({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${space(2)}`,
});
