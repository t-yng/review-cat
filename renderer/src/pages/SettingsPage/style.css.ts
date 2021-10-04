import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  padding: space(4),
});

export const titleWrapperStyle = style({
  paddingBottom: space(1),
  borderBottom: `1px solid ${themeVars.color.gray100}`,
});

export const titleStyle = style({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  lineHeight: '1.5',
});

export const contentStyle = style({
  paddingTop: space(1),
});
