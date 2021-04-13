import "@testing-library/jest-dom";
import {
  fireEvent,
  getByTestId,
  queryByAttribute,
  queryByTestId,
} from "@testing-library/dom";
import { events, items } from "../domain";
import { folder, deepCopy, createItemsFromArray } from "../domain/testUtils";
import { cls, dom } from "../infra";
import { renderTreeView } from "../treeView2";

jest.mock("../infra/animations", () => ({
  expandHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  collapseHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  revertCurrentAnimations: () => false,
}));

const folder1_1_2_1 = folder("folder1_1_2_1");
const folder1_1_1 = folder("folder1_1_1");
const folder1_1_2 = folder("folder1_1_2", [folder1_1_2_1.id]);
const folder1_1 = folder("folder1_1", [folder1_1_1.id, folder1_1_2.id]);
const folder1_2 = folder("folder1_2");
const folder1 = folder("folder1", [folder1_1.id, folder1_2.id]);
const folder2 = folder("folder2");
const home = folder("HOME", [folder1.id, folder2.id]);
const createTestItems = () =>
  deepCopy(
    createItemsFromArray([
      home,
      folder1,
      folder1_1,
      folder1_1_1,
      folder1_1_2,
      folder1_1_2_1,
      folder1_2,
      folder2,
    ])
  );

//HOME
// folder1 (closed by default)
//   folder1_1
//     folder1_1_1
//     folder1_1_2
//       folder1_1_2_1
//   folder1_2
// folder2

describe("Having a treeview with nested folders", () => {
  beforeEach(() => {
    items.itemsLoaded(createTestItems());
    dom.setChildren(document.body, renderTreeView());
  });
  it("should have two closed items", () => {
    const rows = document.getElementsByClassName(cls.treeRow);

    const titles = Array.from(rows).map((el) => el.textContent);
    expect(titles).toEqual(["+" + folder1.title, "+" + folder2.title]);
  });

  describe("expanding folder1", () => {
    beforeEach(() => clickChevron(folder1));

    it("should show its children", () => {
      expect(getRow(folder1_1)).toBeInTheDocument();
    });

    describe("then collapsing folder1", () => {
      beforeEach(() => clickChevron(folder1));

      it("should hide its children", () => {
        expect(queryRow(folder1_1)).not.toBeInTheDocument();
      });

      it("should remove child from event listers", () => {
        expect(events.events["item-collapse"][folder1_1.id]).toBeUndefined();
      });

      it("clearing body should cleanup all event listeners", () => {
        dom.removeAllChildren(document.body);
        expect(JSON.stringify(events.events)).toBe("{}");
      });
    });
  });
});

//page specific queries
const getRow = (item: Item) => queryById("row-" + item.id);
const queryRow = (item: Item) => queryById("row-" + item.id);
const clickChevron = (item: Item) => fireEvent.click(get("chevron-" + item.id));
const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));
const getPageTitle = () => get("page-title");
const queryPageTitle = () => query("page-title");

//general page-agnostic query helpers
const get = (id: string) => getByTestId(document.body, id);
const query = (id: string) => queryByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
const getById = (id: string): Node => {
  const res = queryByAttribute("id", document.body, id);
  if (!res) throw new Error("No element with id: " + id);

  return res;
};
