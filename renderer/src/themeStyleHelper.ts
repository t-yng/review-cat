const SPACE_VALUE = 8;

export const space = (space = 1, unit = 'px') =>
  `${SPACE_VALUE * space}${unit}`;
