import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

export const navStyle = style({
  height: '100%',
  padding: '32px 16px',
  backgroundColor: themeVars.color.gray900,
});
