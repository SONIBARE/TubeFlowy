import "@testing-library/jest-dom";
import {
  fireEvent,
  getByTestId,
  queryByAttribute,
  queryByTestId,
} from "@testing-library/dom";
import { events, items } from "../domain";
import { createItemsFromArray, deepCopy, folder } from "../domain/testUtils";
import { cls, dom } from "../infra";
import { renderApp } from "../page";

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

describe("Rendering the whole app with data", () => {
  beforeEach(() => {
    dom.setChildren(document.body, renderApp());
    items.itemsLoaded(createTestItems());
    events.dispatchEvent("item-focused", home);
  });

  it("page title should be Home", () => {
    expect(getPageTitle()).toHaveTextContent(home.title);
  });

  describe("focusing on item on a sidebar", () => {
    beforeEach(() => {
      const firstSidebarRow = document.getElementsByClassName(
        cls.leftSidebarRow
      )[0];
      fireEvent.click(firstSidebarRow);
    });

    it("should set title to folder1", () => {
      expect(getPageTitle()).toHaveTextContent(folder1.title);
    });
    xit("and then removing the whole app should cleanup all events listeners", () => {
      dom.removeAllChildren(document.body);
      expect(JSON.stringify(events.events)).toEqual("{}");
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
