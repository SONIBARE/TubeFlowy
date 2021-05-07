type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  pageContainer: "page-container",
  header: "header",
  footer: "footer",
  main: "main",
  searchTab: "search-tab",
  searchTabHidden: "search-tab-hidden",
  mainTab: "main-tab",

  title: "title",

  //ROW
  row: "row",
  rowTitle: "row-title",
  rowIcon: "row-icon",
  rowChevron: "row-chevron",
  rowChevronOpen: "row-chevron-open",
  rowCircleEmpty: "row-circle-empty",
} as const;
