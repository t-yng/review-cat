import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const navStyle = style({
  height: '100%',
  padding: `${space(4)} ${space(2)}`,
  backgroundColor: themeVars.color.gray900,
});
