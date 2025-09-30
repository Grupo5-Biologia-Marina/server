const sum = (a: number, b: number): number => a + b;

test("suma 2 + 3 = 5", () => {
  expect(sum(2, 3)).toBe(5);
});