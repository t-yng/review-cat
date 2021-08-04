import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

const listItemStyle = style({
  borderBottom: `1px solid ${themeVars.color.gray100}`,
});

export const styles = {
  listItemStyle,
};
