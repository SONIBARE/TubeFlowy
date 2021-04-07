import "@testing-library/jest-dom";
import {
  fireEvent,
  getByTestId,
  queryByAttribute,
  prettyDOM,
  queryByTestId,
} from "@testing-library/dom";
import { items, events } from "../domain";
import { folder, createItemsFromArray } from "../domain/testUtils";
import { renderTreeView, focusItem } from "./index";
import { cls, timings } from "../infra";

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

//OPEN\CLOSE folder
describe("Having a closed folder1 with children", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    items.itemsLoaded(createTestItems());
    document.body.appendChild(renderTreeView());
    focusItem(home);
  });

  it("children are hidden (folder1_1 is not visible)", () => {
    expect(getRow(folder1)).toBeInTheDocument();
    expect(queryRow(folder1_1)).not.toBeInTheDocument();
  });

  describe("opening folder1 (clicking on a chevron)", () => {
    beforeEach(() => clickChevron(folder1));

    it("shows folder1_1", () => {
      expect(getRow(folder1_1)).toBeInTheDocument();
    });

    describe("closing folder1 (clicking on a chevron again)", () => {
      beforeEach(() => clickChevron(folder1));
      it("hides folder1_1", () => {
        expect(queryRow(folder1_1)).not.toBeInTheDocument();
      });

      it("removing all nodes should cleanup all resouces in event handlers", () => {
        document.body.innerHTML = ``;
        expect(JSON.stringify(events.events)).toEqual("{}");
      });
    });
  });
});

//TRAVERSAL via keyboard
describe("By default when nothing is selected and user presses down", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    items.itemsLoaded(createTestItems());
    document.body.appendChild(renderTreeView());
    focusItem(home);
    press.arrowDown();
  });

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

describe("when every folder is open", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    items.itemsLoaded(createTestItems());
    document.body.appendChild(renderTreeView());
    focusItem(home);
    clickChevron(folder1);
    clickChevron(folder1_1);
    clickChevron(folder1_1_2);
  });
  it("when folder1_1_2_1 is selected pressing down should select folder1_2", () => {
    clickRow(folder1_1_2_1);
    expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
    press.arrowDown();
    expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
  });

  it("when folder1_2 is selected pressing up should select folder1_1_2_1", () => {
    clickRow(folder1_2);
    expect(getRow(folder1_2)).toHaveClass(cls.rowSelected);
    press.arrowUp();
    expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
  });
});

//SELECTION via mouse
describe("Clicking on a folder2", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    items.itemsLoaded(createTestItems());
    document.body.appendChild(renderTreeView());
    focusItem(home);
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

//FOCUS
describe("Focusing on a folder1", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    items.itemsLoaded(createTestItems());
    document.body.appendChild(renderTreeView());
    focusItem(folder1);
  });
  it("shows folder1 title on a page", () => {
    expect(getPageTitle()).toHaveTextContent("folder1 Title");
  });
  it("shows folder1_1 and folder 1_2 title on a page", () => {
    expect(getRow(folder1_1)).toBeInTheDocument();
    expect(getRow(folder1_2)).toBeInTheDocument();
  });

  it("hides folder2", () => {
    expect(queryRow(folder2)).not.toBeInTheDocument();
  });
});

const press = {
  arrowDown: () =>
    fireEvent.keyDown(document.body, {
      key: "ArrowDown",
    }),
  arrowUp: () =>
    fireEvent.keyDown(document.body, {
      key: "ArrowUp",
    }),
  arrowRight: () =>
    fireEvent.keyDown(document.body, {
      key: "ArrowRight",
    }),
  arrowLeft: () =>
    fireEvent.keyDown(document.body, {
      key: "ArrowLeft",
    }),
};

//page specific queries
const getRow = (item: Item) => queryById("row-" + item.id);
const queryRow = (item: Item) => queryById("row-" + item.id);
const clickChevron = (item: Item) => fireEvent.click(get("chevron-" + item.id));
const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));
const getPageTitle = () => get("page-title");

//general page-agnostic query helpers
const get = (id: string) => getByTestId(document.body, id);
const query = (id: string) => queryByTestId(document.body, id);
const queryById = (id: string) => queryByAttribute("id", document.body, id);
const getById = (id: string): Node => {
  const res = queryByAttribute("id", document.body, id);
  if (!res) throw new Error("No element with id: " + id);

  return res;
};

const deepCopy = <T>(i: T): T => JSON.parse(JSON.stringify(i));
