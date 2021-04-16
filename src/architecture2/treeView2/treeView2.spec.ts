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
import { ItemsStore } from "../ItemsStore";
import { renderTreeView } from ".";
import { setItems, setPlayer } from "../domain";
import PlayerStore from "../PlayerStore";

jest.mock("../../infra/animations", () => ({
  animate: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
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
        press.arrowLeft({ alt: true });
        expect(getPageTitle().textContent).toBe(home.title);
      });
    });

    describe("when folder1_1 is focused", () => {
      beforeEach(() => {
        clickChevron(folder1);
        focusRow(folder1_1);
      });

      it("folder1_1 title should be on the screen", () => {
        expect(getPageTitle()).toHaveTextContent(folder1_1.title);
      });

      it("pressing alt + <- focuses on parent (folder1)", () => {
        press.arrowLeft({ alt: true });
        expect(getPageTitle()).toHaveTextContent(folder1.title);
      });

      describe("selecting folder1_1_2", () => {
        beforeEach(() => clickRow(folder1_1_2));

        describe("pressing alt + ->", () => {
          beforeEach(() => press.arrowRight({ alt: true }));
          it("focuses it", () => {
            expect(getPageTitle()).toHaveTextContent(folder1_1_2.title);
          });
          it("selects first child", () => {
            expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
          });
        });

        it("pressing down should still select folder1_1_2 (because it's the last in list and not open)", () => {
          expect(getRow(folder1_1_2)).toHaveClass(cls.rowSelected);
          press.arrowDown();
          expect(getRow(folder1_1_2)).toHaveClass(cls.rowSelected);
        });
      });
    });
  });

  describe("SELECTION via mouse", () => {
    describe("Clicking on a folder2", () => {
      beforeEach(() => {
        clickRow(folder2);
      });
      it("should focus folder2", () => {
        expect(getRow(folder2)).toHaveClass(cls.rowSelected);
      });

      describe("clicking on a folder1", () => {
        beforeEach(() => clickRow(folder1));
        it("should select folder1", () => {
          expect(getRow(folder1)).toHaveClass(cls.rowSelected);
        });
        it("should unselect folder2", () => {
          expect(getRow(folder2)).not.toHaveClass(cls.rowSelected);
        });
      });
    });
  });

  describe("TRAVERSAL via keyboard", () => {
    describe("By default when nothing is selected and user presses down", () => {
      beforeEach(() => press.arrowDown());
      it("first node in focus should be selected (folder1)", () => {
        expect(getRow(folder1)).toHaveClass(cls.rowSelected);
      });
      describe("pressing right", () => {
        beforeEach(() => press.arrowRight());
        it("should expand folder1", () => {
          expect(getRow(folder1_1)).toBeInTheDocument();
          expect(getRow(folder1_1)).not.toHaveClass(cls.rowSelected);
        });
        it("pressing right again should select first child (folder1_1)", () => {
          press.arrowRight();
          expect(getRow(folder1_1)).toHaveClass(cls.rowSelected);
        });
        describe("pressing down", () => {
          beforeEach(() => press.arrowDown());
          it("selects first child (folder1_1)", () => {
            expect(getRow(folder1_1)).toHaveClass(cls.rowSelected);
          });
          describe("pressing up", () => {
            beforeEach(() => press.arrowUp());
            it("should select parent node (folder1)", () => {
              expect(getRow(folder1)).toHaveClass(cls.rowSelected);
            });
            it("pressing up again should still select folder1 (focus node is not selected)", () => {
              press.arrowUp();
              expect(getRow(folder1)).toHaveClass(cls.rowSelected);
            });
          });
          describe("pressing right", () => {
            beforeEach(() => press.arrowRight());
            it("expands content and then pressing left closes them", () => {
              expect(getRow(folder1_1_1)).toBeInTheDocument();
            });
            describe("pressing left", () => {
              beforeEach(() => press.arrowLeft());
              it("closes that node", () => {
                expect(getRow(folder1_1_1)).not.toBeInTheDocument();
              });
              describe("pressing left", () => {
                beforeEach(() => press.arrowLeft());
                it("selects parent that node (folder1)", () => {
                  expect(getRow(folder1)).toHaveClass(cls.rowSelected);
                });
              });
            });
          });
        });
      });
      describe("pressing down", () => {
        beforeEach(() => press.arrowDown());
        it("should select folder2 and unselect folder1", () => {
          expect(getRow(folder2)).toHaveClass(cls.rowSelected);
          expect(getRow(folder1)).not.toHaveClass(cls.rowSelected);
        });
        describe("pressing up", () => {
          beforeEach(() => press.arrowUp());
          it("should select folder1 and unselect folder2", () => {
            expect(getRow(folder1)).toHaveClass(cls.rowSelected);
            expect(getRow(folder2)).not.toHaveClass(cls.rowSelected);
          });
        });
      });
    });
    // describe("when every folder is open", () => {
    //   beforeEach(() => {
    //     items.itemsLoaded(createTestItems());
    //     dom.setChildren(document.body, renderTreeView());
    //     focusItem(home);
    //     clickChevron(folder1);
    //     clickChevron(folder1_1);
    //     clickChevron(folder1_1_2);
    //   });
    //   it("when folder1_1_2_1 is selected pressing down should select folder1_2", () => {
    //     clickRow(folder1_1_2_1);
    //     expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
    //     press.arrowDown();
    //     expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
    //   });
    //   it("when folder1_2 is selected pressing up should select folder1_1_2_1", () => {
    //     clickRow(folder1_2);
    //     expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
    //     press.arrowUp();
    //     expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
    //   });
    // });
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
const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));

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

//general page-agnostic query helpers

const get = (id: string) => getByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
const getById = (id: string): Node => {
  const res = queryByAttribute("id", document.body, id);
  if (!res) throw new Error("No element with id: " + id);

  return res;
};

interface Modifiers {
  alt?: boolean;
}
const press = {
  arrowDown: (modifiers?: Modifiers) =>
    fireEvent.keyDown(document.body, {
      key: "ArrowDown",
      altKey: modifiers?.alt,
    }),
  arrowUp: (modifiers?: Modifiers) =>
    fireEvent.keyDown(document.body, {
      key: "ArrowUp",
      altKey: modifiers?.alt,
    }),
  arrowRight: (modifiers?: Modifiers) =>
    fireEvent.keyDown(document.body, {
      key: "ArrowRight",
      altKey: modifiers?.alt,
    }),
  arrowLeft: (modifiers?: Modifiers) =>
    fireEvent.keyDown(document.body, {
      key: "ArrowLeft",
      altKey: modifiers?.alt,
    }),
};
