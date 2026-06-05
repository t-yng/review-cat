import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  backgroundColor: themeVars.color.accent,
  borderRadius: '4px',
  color: themeVars.color.white,
  fontWeight: 700,
  lineHeight: 1.5,
  ':hover': {
    filter: 'brightness(1.05)',
  },
});

export const sizeStyles = {
  md: style({
    padding: `${space(0.5)} ${space(2)}`,
    fontSize: '1.6rem',
  }),
  lg: style({
    padding: `${space(1)} ${space(3)}`,
    fontSize: '1.8rem',
    borderRadius: '6px',
  }),
};
