type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  dark: "dark",
  light: "light",
  themeButton: "theme-button",
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
  rowChildren: "row-children",
  rowChildrenBorder: "row-children-border",
  rowTitle: "row-title",
  rowIcon: "row-icon",
  rowIconEmpty: "row-icon-empty",
  rowIconOpen: "row-icon-open",
  rowIconClosed: "row-icon-closed",
  rowIconClosedImage: "row-icon-closed-image",
  rowIconMedia: "row-icon-media",
  rowIconMediaRound: "row-icon-media-round",
  rowIconMediaSquare: "row-icon-media-square",
  rowChevron: "row-chevron",
  rowChevronOpen: "row-chevron-open",
  rowCircleEmpty: "row-circle-empty",
  rowCircleOuter: "row-circle-outer",
  rowCircleFilled: "row-circle-filled",
} as const;
