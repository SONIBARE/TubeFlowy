it.todo("fooo");
// import { buildItems } from "./testDataBuilder";

// it("only for home", () => {
//   const template = `
//     Home
//       Sub1
//       Sub2
//         Sub2.1
//       Sub3
//     Search`;
//   const expectedItems: Items = {
//     HOME: {
//       id: "HOME",
//       type: "folder",
//       title: "Home",
//       children: ["Sub1", "Sub2", "Sub3"],
//     },
//     Sub1: {
//       id: "Sub1",
//       type: "folder",
//       title: "Sub1",
//       children: [],
//     },
//     Sub2: {
//       id: "Sub2",
//       type: "folder",
//       title: "Sub2",
//       children: ["Sub2.1"],
//     },
//     "Sub2.1": {
//       id: "Sub2.1",
//       type: "folder",
//       title: "Sub2.1",
//       children: [],
//     },
//     Sub3: {
//       id: "Sub3",
//       type: "folder",
//       title: "Sub3",
//       children: [],
//     },
//     SEARCH: {
//       id: "SEARCH",
//       type: "search",
//       searchTerm: "",
//       title: "Search",
//       children: [],
//     },
//   };
//   expect(buildItems(template)).toEqual(expectedItems);
// });

// it("building items from a template", () => {
//   const template = `
//     Home
//       One
//         Two
//     Search
//       search1
//       search2`;
//   const expectedItems: Items = {
//     HOME: {
//       id: "HOME",
//       type: "folder",
//       title: "Home",
//       children: ["One"],
//     },
//     One: {
//       id: "One",
//       type: "folder",
//       title: "One",
//       children: ["Two"],
//     },
//     Two: {
//       id: "Two",
//       type: "folder",
//       title: "Two",
//       children: [],
//     },
//     SEARCH: {
//       id: "SEARCH",
//       type: "search",
//       searchTerm: "",
//       title: "Search",
//       children: ["search1", "search2"],
//     },
//     search1: {
//       id: "search1",
//       type: "folder",
//       title: "search1",
//       children: [],
//     },
//     search2: {
//       id: "search2",
//       type: "folder",
//       title: "search2",
//       children: [],
//     },
//   };
//   expect(buildItems(template)).toEqual(expectedItems);
// });
