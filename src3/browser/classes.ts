type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  dark: "dark",
  light: "light",
  page: "page",
  footer: "footer",
  main: "main",
  mainTab: "main-tab",

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
  rowIconClosedContainer: "row-icon-closed-image",
  rowIconMedia: "row-icon-media",
  rowIconMediaRound: "row-icon-media-round",
  rowIconMediaSquare: "row-icon-media-square",
  rowChevron: "row-chevron",
  rowChevronOpen: "row-chevron-open",
  rowChevronInactive: "row-chevron-inactive",
  rowCircleEmpty: "row-circle-empty",
  rowCircleOuter: "row-circle-outer",
  rowCircleInner: "row-circle-inner",

  //header
  header: "header",
  headerIconContainer: "header-icon-container",
  headerIcon: "header-icon",
  headerBackIcon: "header-icon-back",
  headerPathText: "header-path-text",
  headerPathSeparator: "header-path-separator",
  headerPathSeparatorIcon: "header-path-separator-icon",
  headerContextMenu: "header-context-menu",
  headerContextMenuVisible: "header-context-menu-visible",
  headerContextMenuItem: "header-context-menu-item",
  headerContextMenuItemActive: "header-context-menu-item-active",

  //Search
  searchTab: "search-tab",
  searchTabHidden: "search-tab-hidden",
  searchInput: "search-input",
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {
  mainBackground: "main-background",
  menuColor: "menu-color",
  textMain: "text-main",
  ambient: "ambient",
  accent: "accent",
  halfAccent: "half-accent",
  backgroundHover: "bg-hover",
  shadowMain: "shadow-main",
} as const;

export type ElementId = valueof<typeof ids>;
export const ids = {
  youtubeFrame: "youtube-frame",
} as const;
