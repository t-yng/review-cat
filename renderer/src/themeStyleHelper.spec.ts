import { space } from './themeStyleHelper';

describe('space', () => {
  test('規定の値が返却される', () => {
    expect(space()).toBe('8px');
  });

  test('倍数を指定できる', () => {
    expect(space(1)).toBe('8px');
    expect(space(2)).toBe('16px');
    expect(space(10)).toBe('80px');
  });

  test('単位を指定できる', () => {
    expect(space(1, 'px')).toBe('8px');
    expect(space(1, 'rem')).toBe('8rem');
    expect(space(1, 'em')).toBe('8em');
  });
});
