import { style } from '@vanilla-extract/css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: space(14),
});
