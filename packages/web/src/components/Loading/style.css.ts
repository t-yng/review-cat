import { keyframes, style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const spinnerStyle = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: `3px solid ${themeVars.color.gray100}`,
  borderTopColor: themeVars.color.accent,
  animation: `${spin} 0.8s linear infinite`,
});
