import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const containerStyle = style({
  padding: space(4),
});

export const titleStyle = style({
  paddingBottom: space(1),
  borderBottom: `1px solid ${themeVars.color.gray100}`,
  marginBottom: space(4),
});

export const completeButtonStyle = style({
  display: 'block',
  margin: 'auto',
  marginTop: space(2),
});
