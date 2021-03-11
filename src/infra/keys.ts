export const cls = {
  rowsContainer: "rows-container",
  row: "row",
  childContainer: "child-container",
  rowText: "row-text",
  rowCircle: "row-circle",
  outerCircle: "row-outer-circle",
  svgContainer: "svg-container",
  chevron: "chevron",
  chevronOpen: "chevron-open",
  none: "",
} as const;

export const ids = {
  root: "root",
} as const;

export const tIds = {};

export const zIndexes = {
  dragAvatar: 200,
  header: 300,
  rightSidebar: 250,
};

type valueof<T> = T[keyof T];

export type ClassPropertyName = keyof typeof cls;
export type ClassName = valueof<typeof cls>;
export type ClassMap = Partial<Record<ClassName, boolean>>;
