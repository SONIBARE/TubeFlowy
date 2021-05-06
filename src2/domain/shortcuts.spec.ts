import { fireEvent } from "@testing-library/dom";
import Store, { TabName } from "./store";
import * as obs from "../infra/observable";
import { init } from "./shortcuts";

describe("App by default ", () => {
  let store: Store;
  let searchVisible: Observer<boolean>;
  let tabFocused: Observer<TabName>;
  beforeEach(() => {
    store = new Store();
    searchVisible = bind(store.onSearchVisibilityChange);
    tabFocused = bind(store.onTabFocus);
    init(store);
  });

  it("search is hidden", () => equal(searchVisible.value, false));

  it("main tab is focused", () => equal<TabName>(tabFocused.value, "main"));

  describe("pressing ctrl + 2", () => {
    beforeEach(() => shortcuts.ctrlAnd2());

    it("shows search", () => equal(searchVisible.value, true));
    it("focuses search", () => equal<TabName>(tabFocused.value, "search"));

    describe("pressing ctrl + 1", () => {
      beforeEach(() => shortcuts.ctrlAnd1());

      it("leaves search visible", () => equal(searchVisible.value, true));
      it("focuses main", () => equal<TabName>(tabFocused.value, "main"));
    });

    describe("pressing ctrl + 2 again", () => {
      beforeEach(() => shortcuts.ctrlAnd2());

      it("hides search", () => equal(searchVisible.value, false));
      it("focuses main", () => equal<TabName>(tabFocused.value, "main"));
    });
  });
});

type Observer<T> = {
  value: T;
};

const bind = <T>(source: obs.Source<T>): Observer<T> => {
  let storedValue: T;
  source.bind((v) => (storedValue = v));
  return {
    get value() {
      return storedValue;
    },
  };
};

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

const equal = <T>(val: T, expected: T) => expect(val).toBe(expected);
