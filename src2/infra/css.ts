import {
  camelToSnakeCase,
  Styles,
  StylesWithOptionalThemes,
  style,
} from "./style";
import * as levels from "./levelClasses";
import { ClassName } from "../../src/infra";

export const margin = (vertical: number, horizontal: number) =>
  `${vertical}px ${horizontal}px`;

type Transition = Partial<Record<keyof Styles, number>>;

export const transition = (transitionDefinition: Transition): string =>
  Object.entries(transitionDefinition)
    .map(([key, value]) => `${camelToSnakeCase(key)} ${value}ms`)
    .join(", ");

export const flexRow = (): Styles => ({
  display: "flex",
  flexDirection: "row",
});

export const flexColumn = (): Styles => ({
  display: "flex",
  flexDirection: "column",
});

export const paddingVertical = (v: number): Styles => ({
  paddingBottom: v,
  paddingTop: v,
});

export const classForLevel = levels.classForLevel;

export const createScrollStyles = (
  className: ClassName,
  props: {
    scrollbar: StylesWithOptionalThemes;
    thumb: StylesWithOptionalThemes;
  }
) => {
  style.selector(`.${className}::-webkit-scrollbar`, props.scrollbar);
  style.selector(`.${className}::-webkit-scrollbar-thumb`, props.thumb);
};
// export const flexCenter = (): Partial<Styles> => ({
//   display: "flex",
//   flexDirection: "column",
// });
