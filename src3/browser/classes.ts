type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  dark: "dark",
  light: "light",
  page: "page",
  header: "header",
  footer: "footer",
  main: "main",
  mainTab: "main-tab",
  searchTab: "search-tab",
  searchTabHidden: "search-tab-hidden",
  themeButton: "theme-button",

  //items tree
  title: "title",
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
  rowCircleInner: "row-circle-inner",
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {
  mainBackground: "main-background",
  menuColor: "menu-color",
  textMain: "text-main",
  ambient: "ambient",
  accent: "accent",
  halfAccent: "half-accent",
  bhHover: "bg-hover",
} as const;
