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

export const searchContainerStyle = style({
  marginTop: space(4),
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: space(1),
});

export const repositoryListStyle = style({
  marginTop: space(2),
  padding: `${space(2)} 0`,
  fontSize: '1.4rem',
});

export const repositoryListItemStyle = style({
  selectors: {
    '&:not(:last-child)': {
      marginBottom: space(1),
    },
  },
});
