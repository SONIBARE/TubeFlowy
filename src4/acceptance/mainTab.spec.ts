import {
  fireEvent,
  getByTestId,
  getByText,
  queryByText,
} from "@testing-library/dom";
import { buildItems } from "../../src2/tests/testDataBuilder";
import App from "../app/App";
import { ClassName, cls } from "../infra";

describe("Having an app with a default state", () => {
  let app: App;
  beforeEach(() => {
    document.body.innerHTML = ``;
    app = new App();
    document.body.appendChild(app.el);
  });

  afterEach(() => app.cleanup());

  describe("when items are loaded", () => {
    beforeEach(() => {
      const items = buildItems(`
      HOME
        folder1
          subfolder2
        folder2
      `);
      app.itemsLoaded(items);
    });
    it("they should show on a screen", () => {
      expect(itemTitle("folder1")).toBeInTheDocument();
      expect(itemTitle("folder2")).toBeInTheDocument();
      expect(itemTitle("subfolder2")).toBeInTheDocument();
    });

    describe("clicking on folder1 chevron", () => {
      beforeEach(() => fireEvent.click(chevronForItemWithTitle("folder1")));

      it("hides subfolder2", () => {
        expect(queryItemTitle("subfolder2")).not.toBeInTheDocument();
      });

      describe("clicking on folder1 chevron again", () => {
        beforeEach(() => fireEvent.click(chevronForItemWithTitle("folder1")));

        it("shows subfolder2", () => {
          expect(itemTitle("subfolder2")).toBeInTheDocument();
        });
      });
    });
  });
});

const itemTitle = (title: string) => getByText(document.body, title);
const queryItemTitle = (title: string) => queryByText(document.body, title);

const chevronForItemWithTitle = (title: string) => {
  const rowTitle = getByText(document.body, title);
  const row = findParentWithClass(rowTitle, cls.row)!;
  return findChildWithClass(row, cls.rowChevron);
};

const findParentWithClass = (el: HTMLElement, className: ClassName) => {
  let res = el.parentElement;
  while (res && !res.classList.contains(className)) {
    res = res.parentElement;
  }
  return res;
};

const findChildWithClass = (el: HTMLElement, className: ClassName) =>
  el.getElementsByClassName(className)[0];
