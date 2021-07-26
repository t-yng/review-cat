import { space } from './themeStyleHelper';

describe('space', () => {
  test('倍数を指定できる', () => {
    expect(space(1)).toBe('8px');
    expect(space(2)).toBe('16px');
    expect(space(10)).toBe('80px');
  });
});
