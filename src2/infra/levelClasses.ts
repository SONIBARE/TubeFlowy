import { spacings } from "./designSystem/spacings";
import { ClassName } from "./designSystem/classes";
import { style } from "./style";

export const classForLevel = (level: number): ClassName =>
  (("level_" + level) as unknown) as ClassName;

const numberOfLevelsToGenerate = 11;

const borderWidth = 2;
const TREE_MAX_WIDTH = 700;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  const base = `max((100% - ${TREE_MAX_WIDTH}px) / 2, 20px)`;
  const levelPadding = `${level * spacings.spacePerLevel}px`;
  style.class(classForLevel(level), {
    paddingLeft: `calc(${base} + ${levelPadding})`,
    paddingRight: 20,
  });
  //   style.class(`children-level_${level}` as any, {
  //     left: `calc(${base} + ${
  //       level * spacings.spacePerLevel +
  //       spacings.chevronSize +
  //       spacings.outerRadius -
  //       borderWidth / 2
  //     }px)`,
  //   });
}
