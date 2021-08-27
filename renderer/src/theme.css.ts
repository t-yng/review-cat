import { createGlobalTheme, style, globalStyle } from '@vanilla-extract/css';

const colors = {
  white: '#fff',
  gray100: '#ccc',
  gray300: '#999',
  gray500: '#777',
  gray700: '#555',
  gray900: '#333',
  accent: '#f2b24e',
  green: '#0A9710',
};

export const themeVars = createGlobalTheme(':root', {
  color: {
    ...colors,
  },
  border: {
    style: `1px solid ${colors.gray100}`,
  },
  bgColor: {
    hoverAccent: 'rgba(242, 179, 78, 0.2)',
  },
});

export const themeFocusVisibleOutline = style({
  ':focus-visible': {
    outlineColor: 'rgba(0, 110, 255, 0.8)',
  },
});

globalStyle('html', {
  fontSize: '0.625rem', // 16px * 0.625 = 10px
});

globalStyle('body', {
  fontSize: '1.6rem',
});

globalStyle('html, body', {
  color: themeVars.color.gray900,
});

globalStyle('h1', {
  fontSize: '1.8rem',
  fontWeight: 'bold',
});
