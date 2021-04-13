import "@testing-library/jest-dom";
import {
  fireEvent,
  getByTestId,
  prettyDOM,
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

    document.body.appendChild(renderTreeView());
    items.focus(home);
  });

  afterEach(() => {
    document.body.innerHTML = ``;
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
          events.events["item-collapse"][folder1_1.id]; //?
          expect(events.events["item-collapse"][folder1_1.id]).toBeUndefined();
        });

        xit("clearing body should cleanup all event listeners", () => {
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

  // xdescribe("TRAVERSAL via keyboard", () => {
  //   describe("By default when nothing is selected and user presses down", () => {
  //     beforeEach(() => press.arrowDown());

  //     it("first node in focus should be selected (folder1)", () => {
  //       expect(getRow(folder1)).toHaveClass(cls.rowSelected);
  //     });

  //     describe("pressing right", () => {
  //       beforeEach(() => press.arrowRight());

  //       it("should expand folder1", () => {
  //         expect(getRow(folder1_1)).toBeInTheDocument();
  //         expect(getRow(folder1_1)).not.toHaveClass(cls.rowSelected);
  //       });

  //       it("pressing right again should select first child (folder1_1)", () => {
  //         press.arrowRight();
  //         expect(getRow(folder1_1)).toHaveClass(cls.rowSelected);
  //       });
  //       describe("pressing down", () => {
  //         beforeEach(() => press.arrowDown());
  //         it("selects first child (folder1_1)", () => {
  //           expect(getRow(folder1_1)).toHaveClass(cls.rowSelected);
  //         });

  //         describe("pressing up", () => {
  //           beforeEach(() => press.arrowUp());
  //           it("should select parent node (folder1)", () => {
  //             expect(getRow(folder1)).toHaveClass(cls.rowSelected);
  //           });

  //           it("pressing up again should still select folder1 (focus node is not selected)", () => {
  //             press.arrowUp();
  //             expect(getRow(folder1)).toHaveClass(cls.rowSelected);
  //           });
  //         });

  //         describe("pressing right", () => {
  //           beforeEach(() => press.arrowRight());
  //           it("expands content and then pressing left closes them", () => {
  //             expect(getRow(folder1_1_1)).toBeInTheDocument();
  //           });

  //           describe("pressing left", () => {
  //             beforeEach(() => press.arrowLeft());
  //             it("closes that node", () => {
  //               expect(getRow(folder1_1_1)).not.toBeInTheDocument();
  //             });
  //             describe("pressing left", () => {
  //               beforeEach(() => press.arrowLeft());
  //               it("selects parent that node (folder1)", () => {
  //                 expect(getRow(folder1)).toHaveClass(cls.rowSelected);
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });

  //     describe("pressing down", () => {
  //       beforeEach(() => press.arrowDown());

  //       it("should select folder2 and unselect folder1", () => {
  //         expect(getRow(folder2)).toHaveClass(cls.rowSelected);
  //         expect(getRow(folder1)).not.toHaveClass(cls.rowSelected);
  //       });

  //       describe("pressing up", () => {
  //         beforeEach(() => press.arrowUp());

  //         it("should select folder1 and unselect folder2", () => {
  //           expect(getRow(folder1)).toHaveClass(cls.rowSelected);
  //           expect(getRow(folder2)).not.toHaveClass(cls.rowSelected);
  //         });
  //       });
  //     });
  //   });

  //   // describe("when every folder is open", () => {
  //   //   beforeEach(() => {
  //   //     items.itemsLoaded(createTestItems());
  //   //     dom.setChildren(document.body, renderTreeView());
  //   //     focusItem(home);
  //   //     clickChevron(folder1);
  //   //     clickChevron(folder1_1);
  //   //     clickChevron(folder1_1_2);
  //   //   });
  //   //   it("when folder1_1_2_1 is selected pressing down should select folder1_2", () => {
  //   //     clickRow(folder1_1_2_1);
  //   //     expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
  //   //     press.arrowDown();
  //   //     expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
  //   //   });

  //   //   it("when folder1_2 is selected pressing up should select folder1_1_2_1", () => {
  //   //     clickRow(folder1_2);
  //   //     expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
  //   //     press.arrowUp();
  //   //     expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
  //   //   });
  //   // });
  // });
});

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

//page specific actions
const clickChevron = (item: Item) => fireEvent.click(chevron(item));
const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));
const focusRow = (item: Item) => fireEvent.click(focusButton(item));

//page specific queries
const getRow = (item: Item) => queryById("row-" + item.id);
const queryRow = (item: Item) => queryById("row-" + item.id);
const getPageTitle = () => get("page-title");
const queryPageTitle = () => query("page-title");

const chevron = (item: Item) => get("chevron-" + item.id);
const focusButton = (item: Item) => get("focuser-" + item.id);

//general page-agnostic query helpers
const get = (id: string) => getByTestId(document.body, id);
const query = (id: string) => queryByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
const getById = (id: string): Node => {
  const res = queryByAttribute("id", document.body, id);
  if (!res) throw new Error("No element with id: " + id);

  return res;
};
