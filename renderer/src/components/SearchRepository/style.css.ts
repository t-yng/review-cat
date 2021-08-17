import { style } from '@vanilla-extract/css';
import { space } from '../../themeStyleHelper';

export const rootStyle = style({
  marginTop: space(4),
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: space(1),
});
