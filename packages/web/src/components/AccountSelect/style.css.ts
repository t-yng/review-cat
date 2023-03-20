import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  position: 'relative',
  width: '100%',
  fontSize: '1.2rem',
});

export const selectButtonStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  color: themeVars.color.gray700,
  padding: space(1),
  border: `0.5px solid ${themeVars.color.gray100}`,
  position: 'relative',
  borderRadius: '2px',
  ':hover': {
    cursor: 'pointer',
  },
});

export const chevronDownIconStyle = style({
  color: themeVars.color.gray500,
});

export const checkIconStyle = style({
  color: themeVars.color.accent,
  position: 'absolute',
  left: space(1),
});

export const listBoxStyle = style({
  position: 'absolute',
  borderRadius: '2px',
  backgroundColor: themeVars.color.white,
  marginTop: space(0.5),
  boxShadow: '0 8px 24px rgb(149 157 165 / 20%)',
  width: '100%',
  ':focus': {
    outline: 'none',
  },
});

export const listBoxItemStyle = style({
  padding: space(1),
  paddingLeft: space(4),
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    backgroundColor: themeVars.bgColor.hoverAccent,
    cursor: 'pointer',
  },
});

export const activeListBoxItemStyle = style({
  backgroundColor: themeVars.bgColor.hoverAccent,
});
