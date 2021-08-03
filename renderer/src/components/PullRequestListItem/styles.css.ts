import { composeStyles, style } from '@vanilla-extract/css';
import { themeVars, themeFocusVisibleOutline } from '../../theme.css';
import { space } from '../../themeStyleHelper';

const rootStyle = composeStyles(
  themeFocusVisibleOutline,
  style({
    display: 'grid',
    gridTemplateAreas: `
      "avatar name"
      "avatar status"
    `,
    gridTemplateColumns: '24px 1fr',
    alignItems: 'center',
    justifyItems: 'left',
    gap: `${space(0.5)} ${space(1)}`,
    padding: `${space(1)} ${space(1.5)}`,
    color: themeVars.color.gray700,
  })
);

export const avatarContainerStyle = style({
  gridArea: 'avatar',
  width: '24px',
});

export const prAuthorNameStyle = style({
  gridArea: 'name',
  fontSize: '14px',
  overflowWrap: 'anywhere',
});

export const prStatusTextStyle = style({
  gridArea: 'status',
  fontSize: '12px',
});

export const styles = {
  rootStyle,
  avatarContainerStyle,
  prAuthorNameStyle,
  prStatusTextStyle,
};
