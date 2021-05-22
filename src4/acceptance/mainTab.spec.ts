import { fireEvent, getByTestId } from "@testing-library/dom";
import App from "../app/App";
import { resetModels } from "../app/store";
import { cls } from "../infra";

it("Pressing ctrl+2 shows search bar", () => {
  resetModels();
  document.body.appendChild(new App().el);
  expect(searchTab()).toHaveClass(cls.searchTabHidden);

  shortcuts.ctrlAnd2();
  expect(searchTab()).not.toHaveClass(cls.searchTabHidden);
});

const searchTab = () => getByTestId(document.body, "search-tab");

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};
