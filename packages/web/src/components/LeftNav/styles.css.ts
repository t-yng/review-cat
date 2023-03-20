import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const navStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  padding: `${space(4)} ${space(2)}`,
  backgroundColor: themeVars.color.gray900,
});

export const pullRequestIconLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: space(0.5),
  ':hover': {
    opacity: 0.8,
  },
});

export const iconStyle = style({
  color: themeVars.color.gray100,
  ':hover': {
    cursor: 'pointer',
  },
});

export const userIconStyle = style({
  marginBottom: space(4),
});

export const statusCountBadge = style({
  borderRadius: '50%',
  background: themeVars.color.gray100,
  color: themeVars.color.gray700,
  width: space(2),
  height: space(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  lineHeight: 1.0,
});
