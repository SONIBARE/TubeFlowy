import "@testing-library/jest-dom";

jest.mock("../infra/browser/animations", () => ({
  animate: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  expandHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  collapseHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  revertCurrentAnimations: () => false,
}));
