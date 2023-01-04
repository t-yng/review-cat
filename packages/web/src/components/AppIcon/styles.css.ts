import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

export const appIconStyle = style({
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: themeVars.color.white,
  overflow: 'hidden',
});

export const appIconSVGStyle = style({
  width: '100%',
  height: '100%',
  verticalAlign: 'middle',
  fill: '#ffe3af',
});
