it.todo("f");
// import "@testing-library/jest-dom";
// import {
//   fireEvent,
//   getByTestId,
//   queryByAttribute,
//   prettyDOM,
//   queryByTestId,
// } from "@testing-library/dom";
// import { items, events } from "../domain";
// import { folder, createItemsFromArray } from "../domain/testUtils";
// import { renderTreeView, focusItem } from "./index";
// import { cls, dom, timings } from "../infra";

// jest.mock("../infra/animations", () => ({
//   expandHeight: () => ({
//     addEventListener: (event: string, cb: EmptyFunc) => cb(),
//   }),
//   collapseHeight: () => ({
//     addEventListener: (event: string, cb: EmptyFunc) => cb(),
//   }),
//   revertCurrentAnimations: () => false,
// }));
// const folder1_1_2_1 = folder("folder1_1_2_1");
// const folder1_1_1 = folder("folder1_1_1");
// const folder1_1_2 = folder("folder1_1_2", [folder1_1_2_1.id]);
// const folder1_1 = folder("folder1_1", [folder1_1_1.id, folder1_1_2.id]);
// const folder1_2 = folder("folder1_2");
// const folder1 = folder("folder1", [folder1_1.id, folder1_2.id]);
// const folder2 = folder("folder2");
// const home = folder("HOME", [folder1.id, folder2.id]);
// const createTestItems = () =>
//   deepCopy(
//     createItemsFromArray([
//       home,
//       folder1,
//       folder1_1,
//       folder1_1_1,
//       folder1_1_2,
//       folder1_1_2_1,
//       folder1_2,
//       folder2,
//     ])
//   );

// //HOME
// // folder1 (closed by default)
// //   folder1_1
// //     folder1_1_1
// //     folder1_1_2
// //       folder1_1_2_1
// //   folder1_2
// // folder2

// //OPEN\CLOSE folder
// describe("Having a closed folder1 with children", () => {
//   beforeEach(() => {
//     items.itemsLoaded(createTestItems());
//     dom.setChildren(document.body, renderTreeView());
//     focusItem(home);
//   });

//   it("children are hidden (folder1_1 is not visible)", () => {
//     expect(getRow(folder1)).toBeInTheDocument();
//     expect(queryRow(folder1_1)).not.toBeInTheDocument();
//   });

//   describe("opening folder1 (clicking on a chevron)", () => {
//     beforeEach(() => clickChevron(folder1));

//     it("shows folder1_1", () => {
//       expect(getRow(folder1_1)).toBeInTheDocument();
//     });

//     describe("closing folder1 (clicking on a chevron again)", () => {
//       beforeEach(() => clickChevron(folder1));
//       it("hides folder1_1", () => {
//         expect(queryRow(folder1_1)).not.toBeInTheDocument();
//       });

//       it("removing all nodes should cleanup all resouces in event handlers", () => {
//         document.body.innerHTML = ``;
//         expect(JSON.stringify(events.events)).toEqual("{}");
//       });
//     });
//   });
// });

// //SELECTION via mouse
// describe("Clicking on a folder2", () => {
//   beforeEach(() => {
//     items.itemsLoaded(createTestItems());
//     dom.setChildren(document.body, renderTreeView());
//     focusItem(home);
//     clickRow(folder2);
//   });
//   it("should focus folder2", () => {
//     expect(getRow(folder2)).toHaveClass(cls.rowSelected);
//   });

//   describe("clicking on a folder1", () => {
//     beforeEach(() => clickRow(folder1));
//     it("should select folder1", () => {
//       expect(getRow(folder1)).toHaveClass(cls.rowSelected);
//     });
//     it("should unselect folder2", () => {
//       expect(getRow(folder2)).not.toHaveClass(cls.rowSelected);
//     });
//   });
// });

// //FOCUS
// describe("Focusing on a folder1", () => {
//   beforeEach(() => {
//     items.itemsLoaded(createTestItems());
//     dom.setChildren(document.body, renderTreeView());
//     focusItem(folder1);
//   });
//   it("shows folder1 title on a page", () => {
//     expect(getPageTitle()).toHaveTextContent("folder1 Title");
//   });
//   it("shows folder1_1 and folder 1_2 title on a page", () => {
//     expect(getRow(folder1_1)).toBeInTheDocument();
//     expect(getRow(folder1_2)).toBeInTheDocument();
//   });

//   it("hides folder2", () => {
//     expect(queryRow(folder2)).not.toBeInTheDocument();
//   });
// });

// describe("when folder1_1 is focused", () => {
//   beforeEach(() => {
//     items.itemsLoaded(createTestItems());
//     dom.setChildren(document.body, renderTreeView());
//     focusItem(folder1_1);
//   });

//   it("folder1_1 title should be on the screen", () => {
//     expect(getPageTitle()).toHaveTextContent(folder1_1.title);
//   });

//   it("pressing alt + <- focuses on parent (folder1)", () => {
//     press.arrowLeft({ alt: true });
//     expect(getPageTitle()).toHaveTextContent(folder1.title);
//   });

//   describe("selecting folder1_1_2", () => {
//     beforeEach(() => clickRow(folder1_1_2));

//     describe("pressing alt + ->", () => {
//       beforeEach(() => press.arrowRight({ alt: true }));
//       it("focuses it", () => {
//         expect(getPageTitle()).toHaveTextContent(folder1_1_2.title);
//       });
//       it("selects first child", () => {
//         expect(getRow(folder1_1_2_1)).toHaveClass(cls.rowSelected);
//       });
//     });

//     it("pressing down should still select folder1_1_2 (because it's the last in list and not open)", () => {
//       expect(getRow(folder1_1_2)).toHaveClass(cls.rowSelected);
//       press.arrowDown();
//       expect(getRow(folder1_1_2)).toHaveClass(cls.rowSelected);
//     });
//   });
// });

// describe("focusing folder1 without opening it", () => {
//   beforeEach(() => {
//     items.itemsLoaded(createTestItems());
//     dom.setChildren(document.body, renderTreeView());
//     focusItem(folder1);
//   });
//   it("focuses folder1 and selects after arrow down folder1_1", () => {
//     expect(getPageTitle()).toHaveTextContent(folder1.title);
//     press.arrowDown();
//     expect(getRow(folder1_1)).toHaveClass(cls.rowSelected);
//   });

//   it("moving out should select folder1 (item which was presivously selected)", () => {
//     press.arrowLeft({ alt: true });
//     expect(queryPageTitle()).not.toBeInTheDocument();
//     expect(getRow(folder1)).toHaveClass(cls.rowSelected);
//   });
// });

// interface Modifiers {
//   alt?: boolean;
// }
// const press = {
//   arrowDown: (modifiers?: Modifiers) =>
//     fireEvent.keyDown(document.body, {
//       key: "ArrowDown",
//       altKey: modifiers?.alt,
//     }),
//   arrowUp: (modifiers?: Modifiers) =>
//     fireEvent.keyDown(document.body, {
//       key: "ArrowUp",
//       altKey: modifiers?.alt,
//     }),
//   arrowRight: (modifiers?: Modifiers) =>
//     fireEvent.keyDown(document.body, {
//       key: "ArrowRight",
//       altKey: modifiers?.alt,
//     }),
//   arrowLeft: (modifiers?: Modifiers) =>
//     fireEvent.keyDown(document.body, {
//       key: "ArrowLeft",
//       altKey: modifiers?.alt,
//     }),
// };

// //page specific queries
// const getRow = (item: Item) => queryById("row-" + item.id);
// const queryRow = (item: Item) => queryById("row-" + item.id);
// const clickChevron = (item: Item) => fireEvent.click(get("chevron-" + item.id));
// const clickRow = (item: Item) => fireEvent.click(getById("row-" + item.id));
// const getPageTitle = () => get("page-title");
// const queryPageTitle = () => query("page-title");

// //general page-agnostic query helpers
// const get = (id: string) => getByTestId(document.body, id);
// const query = (id: string) => queryByTestId(document.body, id);
// const queryById = (id: string) => queryByAttribute("id", document.body, id);
// const getById = (id: string): Node => {
//   const res = queryByAttribute("id", document.body, id);
//   if (!res) throw new Error("No element with id: " + id);

//   return res;
// };

// const deepCopy = <T>(i: T): T => JSON.parse(JSON.stringify(i));
