type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  dark: "dark",
  light: "light",
  page: "page",
  themeButton: "theme-button",
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {
  mainBackground: "main-background",
  textMain: "text-main",
} as const;
