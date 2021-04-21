export const loadLocalItems = (): Items => {
  return {
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
  };

  // const localData = localStorage.getItem("tubeflowyData:v1")!;
  // const parsed = JSON.parse(localData) as any;
  // const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  // return loadedItems;
};
