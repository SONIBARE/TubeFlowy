import { fireEvent, getByTestId } from "@testing-library/dom";
import App from "../app/App";
import { cls } from "../infra";

describe("Having an app with a default state", () => {
  let app: App;
  beforeEach(() => {
    document.body.innerHTML = ``;
    app = new App();
    document.body.appendChild(app.el);
  });

  afterEach(() => app.cleanup());

  it("search bar is hidden", () =>
    expect(searchTab()).toHaveClass(cls.searchTabHidden));

  describe("pressing ctrl+2", () => {
    beforeEach(() => shortcuts.ctrlAnd2());

    it("shows search bar", () =>
      expect(searchTab()).not.toHaveClass(cls.searchTabHidden));

    describe("pressing ctrl+2 again", () => {
      beforeEach(() => shortcuts.ctrlAnd2());

      it("hides search bar", () =>
        expect(searchTab()).toHaveClass(cls.searchTabHidden));
    });
  });
});

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

const searchTab = () => getByTestId(document.body, "search-tab");
