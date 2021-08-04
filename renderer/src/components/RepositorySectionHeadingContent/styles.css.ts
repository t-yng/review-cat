import { style } from '@vanilla-extract/css';
import { themeVars } from 'renderer/src/theme.css';
import { space } from 'renderer/src/themeStyleHelper';

export const rootStyle = style({
  display: 'grid',
  gridTemplateAreas: `"avatar name"`,
  gridTemplateColumns: '24px 1fr',
  alignItems: 'center',
  justifyItems: 'left',
  columnGap: space(1.5),
  padding: `${space(1)} ${space(1.5)}`,
  backgroundColor: themeVars.color.gray700,
  color: themeVars.color.white,
  fontSize: '16px',
  fontWeight: 700,
  textAlign: 'left',
  overflowWrap: 'anywhere',
});

export const avatarContainerStyle = style({
  gridArea: 'avatar',
  alignSelf: 'center',
});

export const nameContainerStyle = style({
  gridArea: 'name',
  overflowWrap: 'anywhere',
});

export const styles = {
  rootStyle,
  avatarContainerStyle,
  nameContainerStyle,
};
