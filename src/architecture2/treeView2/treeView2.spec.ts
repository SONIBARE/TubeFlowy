import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByAttribute } from "@testing-library/dom";
import { dom } from "../../infra";

import { EventsHandler } from "../../domain/eventHandler";
import { folder, deepCopy, createItemsFromArray } from "../../domain/testUtils";
import { MyEvents } from "../events";
import { ItemsStore } from "../ItemsStore";
import { renderTreeView } from ".";

jest.mock("../../infra/animations", () => ({
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

describe("App features:", () => {
  let store: ItemsStore;
  let events: EventsHandler<MyEvents>;
  beforeEach(() => {
    events = new EventsHandler<MyEvents>();
    store = new ItemsStore(events);
    store.itemsLoaded(createTestItems());
    dom.setChildren(document.body, renderTreeView(store));
  });
  describe("OPEN/CLOSE", () => {
    it("folder1 and folder2 should be closed", () => {
      expect(chevron(folder1).textContent).toEqual("+");
      expect(chevron(folder2).textContent).toEqual("+");
    });

    describe("expanding folder1", () => {
      beforeEach(() => clickChevron(folder1));

      it("should show its children", () => {
        expect(getRow(folder1_1)).toBeInTheDocument();
      });

      it("update chevron", () => {
        expect(chevron(folder1).textContent).toEqual("-");
      });

      describe("then collapsing folder1", () => {
        beforeEach(() => clickChevron(folder1));

        it("should hide its children", () => {
          expect(queryRow(folder1_1)).not.toBeInTheDocument();
        });

        it("update chevron", () => {
          expect(chevron(folder1).textContent).toEqual("+");
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

  describe("FOCUS", () => {
    it("by default home is shown as page title", () => {
      expect(getPageTitle()).toHaveTextContent(home.title);
    });
    describe("focusing on folder1", () => {
      beforeEach(() => focusRow(folder1));

      it("shows folder1 title on a page", () => {
        expect(getPageTitle()).toHaveTextContent(folder1.title);
      });

      it("shows folder1_1 and folder 1_2 title on a page", () => {
        expect(getRow(folder1_1)).toBeInTheDocument();
        expect(getRow(folder1_2)).toBeInTheDocument();
      });

      it("hides folder2", () => {
        expect(queryRow(folder2)).not.toBeInTheDocument();
      });
    });
  });
});

//
//
//ACTIONS
const focusRow = (item: Item) => fireEvent.click(focusButton(item));
const clickChevron = (item: Item) => fireEvent.click(chevron(item));
// const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));

//
//
//Queries
const getPageTitle = () => get("page-title");
const getCounter = () => get("increment-button");
const chevron = (item: Item) => get("chevron-" + item.id);
const getRow = (item: Item) => queryById("row-" + item.id);
const queryRow = (item: Item) => queryById("row-" + item.id);
const focusButton = (item: Item) => get("focuser-" + item.id);

//general page-agnostic query helpers
const get = (id: string) => getByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
