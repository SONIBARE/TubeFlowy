export const cls = {
  page: "page",

  header: "header",
  headerIcon: "header-icon",
  headerIconContainer: "header-icon-container",
  headerBackButton: "header-back-button",
  headerPathSeparator: "header-path-separator",
  headerPathText: "header-path-text",
  headerPathTextCurrent: "header-path-text-active",
  lightChevronIcon: "header-light-chevron",
  headerContextMenu: "header-context-menu",
  headerContextMenuItem: "header-context-menu-item",
  headerContextMenuItemActive: "header-context-menu-item-active",
  headerPullRight: "header-pull-right",
  saveButton: "save-button",

  minimap: "minimap",
  minimapTrack: "minimap-track",
  minimapCanvas: "minimap-canvas",

  leftSidebar: "left-sidebar",
  leftSidebarRow: "left-sidebar-row",
  leftSidebarRowChildren: "left-sidebar-row-children",
  leftSidebarChevron: "left-sidebar-row-chevron",
  leftSidebarChevronOpen: "left-sidebar-row-chevron-open",
  leftSidebarChevronHidden: "left-sidebar-row-chevron-hidden",

  rowsContainer: "rows-container",
  pageTitle: "page-title",
  rowsScrollContainer: "rows-scroll-container",
  rowsFocused: "rows-focused",
  rowsHide: "rows-hide",
  row: "row",
  playIcon: "play-icon",
  childContainer: "child-container",
  cardsContainer: "cards-container",
  cardsContainerHeightAdjuster: "cards-container-height-adjuster",
  cardsContainerLastItemPadding: "cards-container-last-item-padding",
  card: "card",
  cardText: "card-text",
  cardImage: "card-image",
  playlistImage: "playlist-image",
  channelImage: "channle-image",
  rowText: "row-text",
  rowCircle: "row-circle",
  outerCircle: "row-outer-circle",
  lightCircle: "row-light-circle",
  focusCircleSvg: "focus-circle-svg",
  chevron: "chevron",
  chevronOpen: "chevron-open",

  playerFooter: "player-footer",

  searchResults: "search-results",
  searchResultsOpen: "search-results-open",

  transparent: "transparent",
  none: "",
} as const;

export const ids = {
  root: "root",
  minimap: "minimap",
  youtubeIframe: "youtube-iframe",
} as const;

export const tIds = {};

export const zIndexes = {
  dragAvatar: 200,
  header: 300,
  minimap: 250,
  rightSidebar: 250,
  iframePlayer: 400,
  playerFooter: 300,
};

type valueof<T> = T[keyof T];

export type ClassPropertyName = keyof typeof cls;
export type ClassName = valueof<typeof cls>;
export type ClassMap = Partial<Record<ClassName, boolean>>;
