import { style } from '@vanilla-extract/css';
import { themeVars } from '../../theme.css';
import { space } from '../../themeStyleHelper';

export const dialogStyle = style({
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 20,
});

export const overlayStyle = style({
  position: 'fixed',
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.8)',
});

export const contentStyle = style({
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: themeVars.bgColor.base,
  zIndex: 10,
  padding: '32px 24px',
  marginTop: '48px',
});

export const closeButtonStyle = style({
  position: 'absolute',
  color: themeVars.color.gray500,
  top: '8px',
  right: '8px',
});
