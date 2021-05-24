import { fireEvent } from "@testing-library/dom";
import { ClassName, cls } from "../browser";
import { App } from "./App";

it("Pressing ctrl + 2 toggles search visibility", () => {
  document.body.innerHTML = ``;
  const app = new App();
  document.body.appendChild(app.container);

  expectToHaveClass(app.view.searchTab, cls.searchTabHidden);
  shortcuts.ctrlAnd2();
  expectNotToHaveClass(app.view.searchTab, cls.searchTabHidden);
  shortcuts.ctrlAnd2();
  expectToHaveClass(app.view.searchTab, cls.searchTabHidden);
});

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

const expectNotToHaveClass = (elem: Element, className: ClassName) =>
  expect(elem).not.toHaveClass(className);

const expectToHaveClass = (elem: Element, className: ClassName) =>
  expect(elem).toHaveClass(className);
