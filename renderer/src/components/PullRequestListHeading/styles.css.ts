import { style } from '@vanilla-extract/css';
import { themeVars } from 'renderer/src/theme.css';
import { space } from 'renderer/src/themeStyleHelper';

export const rootStyle = style({
  padding: `${space(1)} ${space(1.5)}`,
  backgroundColor: themeVars.color.gray700,
  color: themeVars.color.white,
  fontSize: '16px',
  fontWeight: 700,
  textAlign: 'left',
  overflowWrap: 'anywhere',
});

export const styles = {
  rootStyle,
};
