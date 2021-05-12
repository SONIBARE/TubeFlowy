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
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {
  mainBackground: "main-background",
  menuColor: "menu-color",
  textMain: "text-main",
} as const;
