export const cls = {
  header: "header",
  headerIcon: "header-icon",
  headerIconContainer: "header-icon-container",
  headerBackButton: "header-back-button",
  headerPathSeparator: "header-path-separator",
  headerPathText: "header-path-text",
  headerPathTextActive: "header-path-text-active",
  lightChevronIcon: "header-light-chevron",
  headerContextMenu: "header-context-menu",
  headerContextMenuItem: "header-context-menu-item",
  headerContextMenuItemActive: "header-context-menu-item-active",

  minimap: "minimap",
  minimapTrack: "minimap-track",
  minimapCanvas: "minimap-canvas",

  rowsContainer: "rows-container",
  rowsFocused: "rows-focused",
  rowsHide: "rows-hide",
  row: "row",
  childContainer: "child-container",
  cardsContainer: "cards-container",
  cardsContainerHeightAdjuster: "cards-container-height-adjuster",
  cardsContainerLastItemPadding: "cards-container-last-item-padding",
  card: "card",
  cardText: "card-text",
  cardImage: "card-image",

  rowText: "row-text",
  rowCircle: "row-circle",
  outerCircle: "row-outer-circle",
  lightCircle: "row-light-circle",
  focusCircleSvg: "focus-circle-svg",
  chevron: "chevron",
  chevronOpen: "chevron-open",

  transparent: "transparent",
  none: "",
} as const;

export const ids = {
  root: "root",
} as const;

export const tIds = {};

export const zIndexes = {
  dragAvatar: 200,
  header: 300,
  minimap: 250,
  rightSidebar: 250,
};

type valueof<T> = T[keyof T];

export type ClassPropertyName = keyof typeof cls;
export type ClassName = valueof<typeof cls>;
export type ClassMap = Partial<Record<ClassName, boolean>>;
