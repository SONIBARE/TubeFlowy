import { compose } from "./functions";

it("composing functions should pass value further", () => {
  const add = (a: number) => (b: number) => a + b;
  const multiply = (a: number) => (b: number) => a * b;

  const addTwoAndMultiplyBy6 = compose(multiply(6), add(2));

  expect(addTwoAndMultiplyBy6(3)).toEqual((3 + 2) * 6);
});
