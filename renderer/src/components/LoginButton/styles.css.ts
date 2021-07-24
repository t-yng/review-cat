import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

export const buttonStyle = style({
  padding: '8px 16px',
  backgroundColor: themeVars.color.accent,
  borderRadius: '4px',
  color: themeVars.color.white,
  fontSize: '1rem',
  fontWeight: 700,
  lineHeight: 1.5,
});
