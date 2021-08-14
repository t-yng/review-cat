import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';

const listItemStyle = style({
  borderBottom: themeVars.border.style,
});

export const styles = {
  listItemStyle,
};
