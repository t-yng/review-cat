import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  position: 'relative',
  width: '100%',
});

export const selectStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
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

export const selectMenuStyle = style({
  position: 'absolute',
  padding: space(1),
  border: `1px solid ${themeVars.color.gray100}`,
  backgroundColor: themeVars.color.white,
  marginTop: space(1),
  boxShadow: '0 8px 24px rgb(149 157 165 / 20%)',
  width: '100%',
});
