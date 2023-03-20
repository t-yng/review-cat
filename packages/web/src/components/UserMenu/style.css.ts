import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const userMenuStyle = style({
  display: 'flex',
  flexDirection: 'column',
  left: space(1),
  marginTop: space(0.5),
  width: 'max-content',
  minWidth: '100px',
  background: themeVars.bgColor.base,
  border: `1px solid ${themeVars.color.gray100}`,
  borderRadius: '4px',
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
  position: 'absolute',
});

export const listItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${space(1)} ${space(2)}`,
  lineHeight: '1.5',
  selectors: {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${themeVars.color.gray100}`,
    },
  },
});

export const actionIconStyle = style({
  color: themeVars.color.gray500,
});

export const actionLabelStyle = style({
  marginLeft: space(1),
  lineHeight: 1.2,
});

export const userNameStyle = style({
  color: themeVars.color.gray900,
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

export const actionItemStyle = style({
  color: themeVars.color.gray700,
  fontSize: '1.4rem',
  ':hover': {
    cursor: 'pointer',
    background: themeVars.bgColor.hoverAccent,
  },
});
