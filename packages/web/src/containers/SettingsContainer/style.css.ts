import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const settingSectionStyle = style({
  marginBottom: space(2),
});

export const settingSectionTitleStyle = style({
  fontSize: '1.6rem',
  fontWeight: 'bold',
  lineHeight: '1.5',
});

export const settingItemListStyle = style({
  paddingTop: space(0.5),
});

export const settingItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.4rem',
  lineHeight: '1.5',
});

export const settingItemLabelStyle = style({
  marginLeft: space(1),
});

export const repositoryListStyle = style({
  maxWidth: 200,
});

export const repositoryListItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space(1),
  lineHeight: 1.5,
  fontSize: '1.4rem',
  selectors: {
    '&:last-of-type': {
      marginBottom: 4,
    },
  },
});

export const ellipsisStyle = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export const deleteButtonStyle = style({
  display: 'inline-flex',
});

export const deleteIconStyle = style({
  color: themeVars.color.red,
  ':hover': {
    cursor: 'pointer',
    opacity: 0.8,
  },
});

export const addRepositoryStyle = style({
  ':hover': {
    opacity: 0.8,
  },
});
