import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const containerStyle = style({
  padding: space(4),
});

export const titleStyle = style({
  paddingBottom: space(1),
  borderBottom: `1px solid ${themeVars.color.gray100}`,
});

export const repositoryListStyle = style({
  marginTop: space(2),
  fontSize: '1.4rem',
});

export const repositoryListItemStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${space(0.5)} 0`,
  ':first-child': {
    paddingTop: 0,
  },
});

export const repositoryLinkStyle = style({
  transition: 'opacity 0.1s ease-in',
  width: '100%',
  ':hover': {
    opacity: 0.7,
  },
});

export const iconButtonStyle = style({
  ':hover': {
    cursor: 'pointer',
  },
});

export const iconStyle = style({
  color: themeVars.color.green,
});

export const completeButtonStyle = style({
  display: 'block',
  margin: 'auto',
  marginTop: space(2),
});
