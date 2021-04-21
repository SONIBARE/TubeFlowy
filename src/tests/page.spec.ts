import { ClassName, cls, dom } from "../infra";
import { fireEvent } from "@testing-library/dom";
import { viewAppShell } from "../page";

jest.mock("../stateLoader", () => ({
  loadLocalItems: (): Items => ({
    HOME: {
      id: "HOME",
      type: "folder",
      title: "Home",
      children: ["1", "2"],
    },
    "1": {
      id: "1",
      type: "folder",
      title: "One",
      children: [],
    },
    "2": {
      id: "2",
      type: "folder",
      title: "Two",
      children: [],
    },
    SEARCH: {
      id: "SEARCH",
      type: "search",
      searchTerm: "",
      title: "Search",
      children: ["search1", "search2"],
    },
    search1: {
      id: "search1",
      type: "folder",
      title: "Search One",
      children: [],
    },
    search2: {
      id: "search2",
      type: "folder",
      title: "Search Two",
      children: [],
    },
  }),
}));

describe("Having an app", () => {
  beforeEach(() => {
    dom.setChildren(document.body, viewAppShell());
  });
  it("by default search is hidden", () =>
    expectSearchToHaveClass(cls.searchHidden));
});

const expectSearchToHaveClass = (className: ClassName) =>
  expect(getById("search")).toHaveClass(className);

const getRow = (itemId: string): Element => getById("row-" + itemId) as Element;
const getById = (id: string): Node => document.getElementById(id)!;
