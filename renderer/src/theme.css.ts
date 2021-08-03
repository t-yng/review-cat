import { createGlobalTheme, style } from '@vanilla-extract/css';

export const themeVars = createGlobalTheme(':root', {
  color: {
    white: '#fff',
    gray100: '#ccc',
    gray300: '#999',
    gray500: '#777',
    gray700: '#555',
    gray900: '#333',
    accent: '#f2b24e',
  },
});

export const themeFocusVisibleOutline = style({
  ':focus-visible': {
    outlineColor: 'rgba(0, 110, 255, 0.8)',
  },
});
