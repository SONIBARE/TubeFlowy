// import { store } from "../domain";
import * as model from "../model";
import { cls, css, cssVar, dom, style } from "../../browser";
import { colors, spacings, levels, timings, icons } from "../../designSystem";

import ItemIcon from "./ItemIcon";

const viewChevron = (item: Item) => {
  const chevron = icons.chevron({
    className: cls.rowChevron,
    // onClick: () => store.toggleIsItemCollapse(item.id),
  });
  //TODO: fix memory leak
  //TODO: figure out declarative way to return element and subscription
  // const subscription = store.itemOpen.bind(item.id, (item) =>
  //   dom.updateClass(chevron, cls.rowChevronOpen, items.isOpen(item))
  // );
  return chevron;
};

const viewItemWithChildren = (item: Item, items: Items, level: number) => {
  const icon = new ItemIcon(item);
  const row = dom.div({
    classNames: [cls.row, levels.classForLevel(level)],
    children: [
      viewChevron(item),
      icon.svg,
      dom.span({ className: cls.rowTitle, text: item.title }),
    ],
  });
  let children: Element | undefined = model.isOpen(item)
    ? viewItemChildren(item, items, level)
    : undefined;

  // const unsub = store.itemOpen.onChange(item.id, (item) => {
  //   icon.update(item);
  //   if (items.isOpen(item)) {
  //     children = viewItemChildren(item, level);
  //     row.insertAdjacentElement("afterend", children);
  //   } else {
  //     if (children) {
  //       children.remove();
  //       children = undefined;
  //     }
  //   }
  // });
  return dom.fragment([row, children]);
};

export const viewChildren = (itemId: string, items: Items, level = 0): Node[] =>
  model
    .getChildrenFor(itemId, items)
    .map((item) => viewItemWithChildren(item, items, level));

const viewItemChildren = (item: Item, items: Items, level: number) =>
  dom.div({
    className: cls.rowChildren,
    children: viewChildren(item.id, items, level + 1).concat(
      childrenBorder(level)
    ),
  });

export const childrenBorder = (level: number) =>
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

style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevron, { opacity: 1 });
