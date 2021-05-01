it.todo("fooo");
// import { ClassName, cls, dom, EventsHandler } from "../infra";
// import { fireEvent, getByTestId } from "@testing-library/dom";
// import { viewAppShell } from "../page";
// import * as domain from "../domain";
// import { buildItems } from "./testDataBuilder";

// const searchTab = () => get("search");
// const mainTab = () => get("main");

// const get = (id: string) => getByTestId(document.body, id);
// const getById = (id: string) => document.getElementById(id)!;

// const row = (id: string) => getById("row-" + id);
// const queryChild = (node: Element, className: ClassName) =>
//   node.getElementsByClassName(className)[0];

// const shell = {
//   expect: {
//     searchIsHidden: () => expect(searchTab()).toHaveClass(cls.searchTabHidden),
//     searchIsVisible: () =>
//       expect(searchTab()).not.toHaveClass(cls.searchTabHidden),
//     mainFocused: () => expect(mainTab()).toHaveClass(cls.tabFocused),
//     searchFocused: () => expect(searchTab()).toHaveClass(cls.tabFocused),
//     hasRow: (id: string) => expect(row(id)).toBeInTheDocument(),
//     rowToBeSelected: (id: string) =>
//       expect(row(id)).toHaveClass(cls.rowSelected),
//     rowNOTToBeSelected: (id: string) =>
//       expect(row(id)).not.toHaveClass(cls.rowSelected),

//     rowToBeHighlighted: (id: string) =>
//       expect(queryChild(row(id), cls.treeRowHighlight)).toBeInTheDocument(),
//     rowNOTToBeHighlighted: (id: string) =>
//       expect(queryChild(row(id), cls.treeRowHighlight)).toBeUndefined(),
//   },

//   actions: {
//     toggleSearchTab: () =>
//       fireEvent.keyDown(document, { code: "KeyK", ctrlKey: true }),
//     focusOnSearch: () =>
//       fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
//     focusOnMain: () =>
//       fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
//     pressDown: () => fireEvent.keyDown(document, { code: "ArrowDown" }),
//     pressUp: () => fireEvent.keyDown(document, { code: "ArrowUp" }),
//     pressLeft: () => fireEvent.keyDown(document, { code: "ArrowLeft" }),
//     pressRight: () => fireEvent.keyDown(document, { code: "ArrowRight" }),
//   },
// };

// xdescribe("Having a loaded app", () => {
//   beforeEach(() => {
//     const events = new EventsHandler<MyEvents>();
//     domain.init(events);
//     domain.items.itemsLoaded(
//       buildItems(`
//     Home
//       first
//       second
//     Search
//       search1
//       search2
//     `)
//     );
//     dom.setChildren(document.body, viewAppShell());
//   });

//   afterEach(domain.cleanup);

//   it("by default search tab is hidden", () => shell.expect.searchIsHidden());

//   it("by default main tab is focused", () => shell.expect.mainFocused());

//   describe("pressing 'show search'", () => {
//     beforeEach(() => shell.actions.toggleSearchTab());

//     it("search tab is shown", () => shell.expect.searchIsVisible());
//     it("search tab is focused", () => shell.expect.searchFocused());

//     describe("toggling search again", () => {
//       beforeEach(() => shell.actions.toggleSearchTab());

//       it("hides search tab", () => shell.expect.searchIsHidden());
//       it("focuses on main", () => shell.expect.mainFocused());
//     });

//     describe("switching focus to main", () => {
//       beforeEach(() => shell.actions.focusOnMain());

//       it("leaves search tab", () => shell.expect.searchIsVisible());
//       it("focuses on main", () => shell.expect.mainFocused());
//     });
//   });

//   it("should have 'first' row", () => shell.expect.hasRow("first"));
//   it("should have 'second' row", () => shell.expect.hasRow("second"));

//   describe("pressing down", () => {
//     beforeEach(() => shell.actions.pressDown());

//     it("should mark 'first' row as selected", () =>
//       shell.expect.rowToBeSelected("first"));

//     it("should highlight 'first' row", () =>
//       shell.expect.rowToBeHighlighted("first"));

//     describe("pressing down again", () => {
//       beforeEach(() => shell.actions.pressDown());

//       it("should unmark 'second' row as selected", () =>
//         shell.expect.rowNOTToBeSelected("first"));

//       it("should mark 'second' row as selected", () =>
//         shell.expect.rowToBeSelected("second"));

//       it("should highlight 'second' row", () =>
//         shell.expect.rowToBeHighlighted("second"));
//       it("should unhighlight 'first' row", () =>
//         shell.expect.rowNOTToBeHighlighted("first"));
//     });
//   });
// });
