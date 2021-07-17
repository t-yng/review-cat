import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

export const buttonStyle = style({
  display: 'inline-block',
  alignItems: 'center',
  maxWidth: '100%',
  minHeight: '40px',
  padding: '8px 16px',
  backgroundColor: themeVars.color.accent,
  borderRadius: '4px',
  color: themeVars.color.white,
  fontSize: '1rem',
  fontWeight: 700,
  textAlign: 'center',
});
