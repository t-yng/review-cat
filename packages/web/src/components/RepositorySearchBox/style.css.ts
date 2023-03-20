import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  width: '100%',
  border: `1px solid ${themeVars.color.gray100}`,
  borderRadius: '2px',
  padding: space(1),
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.2rem',
});

export const iconStyle = style({
  color: themeVars.color.gray300,
});

export const inputStyle = style({
  paddingLeft: space(1),
  '::placeholder': {
    color: themeVars.color.gray300,
  },
});
