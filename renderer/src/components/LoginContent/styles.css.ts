import { style } from '@vanilla-extract/css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  textAlign: 'center',
});

export const iconContainerStyle = style({
  maxWidth: `${space(12)}`,
  margin: 'auto',
});

export const buttonContainerStyle = style({
  marginTop: `${space(12)}`,
});
