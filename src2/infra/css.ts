import { camelToSnakeCase, Styles } from "./style";
import * as levels from "./levelClasses";

export const margin = (vertical: number, horizontal: number) =>
  `${vertical}px ${horizontal}px`;

type Transition = Partial<Record<keyof Styles, number>>;

export const transition = (transitionDefinition: Transition): string =>
  Object.entries(transitionDefinition)
    .map(([key, value]) => `${camelToSnakeCase(key)} ${value}ms`)
    .join(", ");

export const flexRow = (): Partial<Styles> => ({
  display: "flex",
  flexDirection: "row",
});

export const flexColumn = (): Partial<Styles> => ({
  display: "flex",
  flexDirection: "column",
});

export const classForLevel = levels.classForLevel;
// export const flexCenter = (): Partial<Styles> => ({
//   display: "flex",
//   flexDirection: "column",
// });
