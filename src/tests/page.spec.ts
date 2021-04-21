import { cls, dom, EventsHandler } from "../infra";
import { fireEvent, getByTestId } from "@testing-library/dom";
import { viewAppShell } from "../page";
import * as domain from "../domain";

const searchTab = () => get("search");
const mainTab = () => get("main");

const get = (id: string) => getByTestId(document.body, id);

const shell = {
  expect: {
    searchIsHidden: () => expect(searchTab()).toHaveClass(cls.searchTabHidden),
    searchIsVisible: () =>
      expect(searchTab()).not.toHaveClass(cls.searchTabHidden),
    mainFocused: () => expect(mainTab()).toHaveClass(cls.tabFocused),
    searchFocused: () => expect(searchTab()).toHaveClass(cls.tabFocused),
  },

  actions: {
    toggleSearchTab: () =>
      fireEvent.keyDown(document, { code: "KeyK", ctrlKey: true }),
    focusOnSearch: () =>
      fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
    focusOnMain: () =>
      fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
  },
};

describe("Having a loaded app", () => {
  beforeEach(() => {
    const events = new EventsHandler<MyEvents>();
    domain.init(events);
    dom.setChildren(document.body, viewAppShell());
  });

  afterEach(domain.cleanup);

  it("by default search tab is hidden", () => shell.expect.searchIsHidden());

  it("by default main tab is focused", () => shell.expect.mainFocused());

  describe("pressing 'show search'", () => {
    beforeEach(() => shell.actions.toggleSearchTab());

    it("search tab is shown", () => shell.expect.searchIsVisible());
    it("search tab is focused", () => shell.expect.searchFocused());

    describe("toggling search again", () => {
      beforeEach(() => shell.actions.toggleSearchTab());

      it("hides search tab", () => shell.expect.searchIsHidden());
      it("focuses on main", () => shell.expect.mainFocused());
    });

    describe("switching focus to main", () => {
      beforeEach(() => shell.actions.focusOnMain());

      it("leaves search tab", () => shell.expect.searchIsVisible());
      it("focuses on main", () => shell.expect.mainFocused());
    });
  });
});
