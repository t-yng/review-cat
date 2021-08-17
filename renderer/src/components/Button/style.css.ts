import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  padding: `${space(0.5)} ${space(2)}`,
  backgroundColor: themeVars.color.accent,
  borderRadius: '4px',
  color: themeVars.color.white,
  fontSize: '1.6rem',
  fontWeight: 700,
  lineHeight: 1.5,
});
