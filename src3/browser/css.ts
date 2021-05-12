import { VariableName } from "./classes";
import { camelToSnakeCase, Styles } from "./style";

type Transition = PartialRecord<keyof Styles, number>;

export const transition = (transitionDefinition: Transition): string =>
  Object.entries(transitionDefinition)
    .map(([key, value]) => `${camelToSnakeCase(key)} ${value}ms`)
    .join(", ");

export const useVar = (variableName: VariableName) => `var(--${variableName})`;
