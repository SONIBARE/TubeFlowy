export const cls = {
  box: "box",
  boxRed: "box-red",

  page: "page",

  header: "header",
  headerIcon: "header-icon",
  headerIconInactive: "header-icon-inactive",
  headerIconContainer: "header-icon-container",
  headerBackButton: "header-back-button",
  headerPathSeparator: "header-path-separator",
  headerPathText: "header-path-text",
  headerPathTextCurrent: "header-path-text-active",
  lightChevronIcon: "header-light-chevron",
  headerContextMenu: "header-context-menu",
  headerContextMenuVisible: "header-context-menu-visible",
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

  //row folrder icon
  focusCircleSvg: "focus-circle-svg",
  focusCircleSvgEmpty: "focus-circle-svg-empty",
  focusCircleSvgFilledOpen: "focus-circle-svg-filled-open",
  focusCircleSvgFilledClosed: "focus-circle-svg-filled-closed",
  focusCircleSvgPlaying: "focus-circle-svg-playing",

  rowCircleFilled: "row-circle-fillded",
  rowCircleOuter: "row-circle-outer",
  rowCircleEmpty: "row-circle-empty",
  rowCirclePlay: "row-circle-play",
  rowCirclePause: "row-circle-pause",

  childContainer: "child-container",
  rowText: "row-text",
  rowTextVideo: "row-text-video",

  squareImage: "square-image",
  closedContainerImage: "container-image",
  channelImage: "channle-image",

  chevron: "chevron",
  chevronOpen: "chevron-open",

  playerFooter: "player-footer",
  yotuubePlayerhidden: "youtube-player-hidden",

  searchResults: "search-results",
  searchResultsOpen: "search-results-open",

  //dnd
  dragAvatar: "drag-avatar",
  dragDestination: "drag-destination",
  dragDestinationBulp: "drag-destination-bulp",

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
