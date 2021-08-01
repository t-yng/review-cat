import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const buttonStyle = style({
  padding: `${space(1)} ${space(2)}`,
  backgroundColor: themeVars.color.accent,
  borderRadius: `${space(0.5)}`,
  color: themeVars.color.white,
  fontSize: '1rem',
  fontWeight: 700,
  lineHeight: 1.5,
});
