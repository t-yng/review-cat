export function testEach(
  cases: any[][] | Record<string, any>[]
): (name: string, fn: any) => void {
  return (name, fn) => {
    cases.forEach((items) => {
      if (items) {
        if (items instanceof Array) {
          test(name, () => fn(...items));
        } else {
          test(name, () => fn({ ...items }));
        }
      }
    });
  };
}
