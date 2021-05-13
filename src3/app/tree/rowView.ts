import { cls, css, cssVar, dom, style } from "../../browser";
import { spacings, levels, timings, icons } from "../../designSystem";
import * as model from "../model";
import ItemIcon from "./ItemIcon";

export type RowEvents = {
  onChevronClick: EmptyAction;
};
export const viewRow = (
  item: Item,
  events: RowEvents,
  icon: ItemIcon,
  level: number
) =>
  dom.div({
    classNames: [cls.row, levels.classForLevel(level)],
    classMap: { [cls.rowChevronOpen]: model.isOpen(item) },
    children: [
      icons.chevron({
        onClick: events.onChevronClick,
        className: cls.rowChevron,
      }),
      icon.svg,
      dom.span({ className: cls.rowTitle, text: item.title }),
    ],
  });

export const updateChevron = (row: Element, isItemOpen: boolean) =>
  dom.assignClassMap(row, {
    [cls.rowChevronOpen]: isItemOpen,
  });

export const viewChildren = (nodes: Node[], level: number) =>
  dom.div({
    className: cls.rowChildren,
    children: nodes.concat(childrenBorder(level - 1)),
  });

const childrenBorder = (level: number) =>
  dom.div({
    classNames: [cls.rowChildrenBorder, levels.childrenForLevel(level)],
  });

style.class(cls.row, {
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
  cursor: "pointer",
  ...css.paddingVertical(4),
  onHover: {
    backgroundColor: css.useVar(cssVar.bhHover),
  },
});

style.class(cls.rowChildren, {
  position: "relative",
});

style.class(cls.rowChildrenBorder, {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: css.useVar(cssVar.ambient),
  transition: css.transition({ backgroundColor: timings.themeSwitchDuration }),
});

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
});

style.class(cls.rowChevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  transition: css.transition({
    transform: 200,
    opacity: 100,
  }),
  color: css.useVar(cssVar.halfAccent),
  opacity: 0,
  userSelect: "none",

  onHover: {
    color: "currentColor",
  },
});

style.parentChild(cls.rowChevronOpen, cls.rowChevron, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevron, { opacity: 1 });
