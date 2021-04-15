import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByAttribute } from "@testing-library/dom";
import { cls, dom } from "../../infra";

import { EventsHandler } from "../../domain/eventHandler";
import {
  folder,
  deepCopy,
  createItemsFromArray,
  video,
} from "../../domain/testUtils";
import { MyEvents } from "../events";
import { ItemsStore } from "../ItemsStore";
import { renderTreeView } from ".";
import { setItems, setPlayer } from "../domain";
import PlayerStore from "../PlayerStore";
import { pause } from "../../player/youtubePlayer";

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
const video1_3 = video("video1_3", "youtube1_2");
const folder1 = folder("folder1", [folder1_1.id, folder1_2.id, video1_3.id]);
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
      video1_3,
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
//   video1_3
// folder2

describe("App features:", () => {
  let store: ItemsStore;
  let events: EventsHandler<MyEvents>;

  beforeEach(() => {
    events = new EventsHandler<MyEvents>();
    store = new ItemsStore(events);
    setItems(store);
    setPlayer(new PlayerStore(events));
    store.itemsLoaded(createTestItems());
    dom.setChildren(document.body, renderTreeView());
  });

  describe("OPEN/CLOSE", () => {
    it("folder1 and folder2 should be closed", () => {
      expect(chevron(folder1)).not.toHaveClass(cls.chevronOpen);
      expect(chevron(folder2)).not.toHaveClass(cls.chevronOpen);
    });

    it("folder1 is non-empty so outer circle should be shown and empty circle is hidden", () => {
      expect(outerCircle(folder1)).toHaveStyle("opacity: 1");
      expect(emptyCircle(folder1)).toHaveStyle("opacity: 0");
    });

    it("folder2 is empty so outer and inner circles are hidden and empty circle is visible", () => {
      expect(outerCircle(folder2)).toHaveStyle("opacity: 0");
      expect(innerCircle(folder2)).toHaveStyle("opacity: 0");
      expect(emptyCircle(folder2)).toHaveStyle("opacity: 1");
    });

    describe("expanding folder1", () => {
      beforeEach(() => clickChevron(folder1));

      it("should show its children", () => {
        expect(getRow(folder1_1)).toBeInTheDocument();
      });

      it("update chevron", () => {
        expect(chevron(folder1)).toHaveClass(cls.chevronOpen);
      });

      it("hide outer circle", () => {
        expect(outerCircle(folder1)).toHaveStyle("opacity: 0");
      });

      describe("then collapsing folder1", () => {
        beforeEach(() => clickChevron(folder1));

        it("should hide its children", () => {
          expect(queryRow(folder1_1)).not.toBeInTheDocument();
        });

        it("update chevron", () => {
          expect(chevron(folder1)).not.toHaveClass(cls.chevronOpen);
        });
        it("show outer circle", () => {
          expect(outerCircle(folder1)).toHaveStyle("opacity: 1");
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

      it("going back should focus on Home again", () => {
        clickBack();
        expect(getPageTitle().textContent).toBe(home.title);
      });
    });
  });

  describe("PLAYER", () => {
    it("opening folder1 and clicking play on a video1_3 should show pause icon", () => {
      const [leftPause, rightPause] = pauseIcons(folder1);
      const folderr1PlayIcon = playIcon(folder1);
      expect(leftPause).toHaveStyle("opacity: 0");
      expect(rightPause).toHaveStyle("opacity: 0");
      expect(folderr1PlayIcon).toHaveStyle("opacity: 0");
      clickFolderIcon(folder1);
      expect(leftPause).toHaveStyle("opacity: 1");
      expect(rightPause).toHaveStyle("opacity: 1");
      expect(folderr1PlayIcon).toHaveStyle("opacity: 0");
    });
  });
});

//
//
//ACTIONS
const focusRow = (item: Item) =>
  fireEvent.click(itemIcon(item), {
    ctrlKey: true,
  });

const clickChevron = (item: Item) => fireEvent.click(chevron(item));
const clickBack = () => fireEvent.click(get("go-back"));
const clickFolderIcon = (item: Item) => fireEvent.click(itemIcon(item));
// const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));

//
//
//Queries
const getPageTitle = () => get("page-title");
const getCounter = () => get("increment-button");
const chevron = (item: Item) => get("chevron-" + item.id);
const outerCircle = (item: Item) => itemIcon(item).children[0];
const innerCircle = (item: Item) => itemIcon(item).children[1];
const emptyCircle = (item: Item) => itemIcon(item).children[2];
const playIcon = (item: Item) => itemIcon(item).children[3];
const pauseIcons = (item: Item) => [
  itemIcon(item).children[4],
  itemIcon(item).children[5],
];

const itemIcon = (item: Item) => get("itemIcon-" + item.id);
const getRow = (item: Item) => queryById("row-" + item.id);
const queryRow = (item: Item) => queryById("row-" + item.id);
const focusButton = (item: Item) => get("focuser-" + item.id);

//general page-agnostic query helpers
const get = (id: string) => getByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
