import { store } from "../domain";
import * as items from "../domain/items";
import { cls, colors, css, dom, icons, style, spacings } from "../infra";
import ItemIcon from "./ItemIcon";

const viewChevron = (item: Item) => {
  const chevron = icons.chevron({
    className: cls.rowChevron,
    onClick: () => store.toggleIsItemCollapse(item.id),
  });
  //TODO: fix memory leak
  //TODO: figure out declarative way
  const subscription = store.itemCollapse.bind(item.id, (isOpen) =>
    dom.updateClass(chevron, cls.rowChevronOpen, isOpen)
  );
  return chevron;
};

const viewRow = (item: Item, level: number) => {
  const icon = new ItemIcon(item);
  return dom.div({
    classNames: [cls.row, css.classForLevel(level)],
    children: [
      viewChevron(item),
      icon.create(),
      dom.span({ className: cls.rowTitle, text: item.title }),
    ],
  });
};

export const viewChildren = (itemId: string, level = 0) =>
  items
    .getChildrenFor(itemId, store.itemsState)
    .map((item) => viewRow(item, level));

style.class(cls.row, {
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
  cursor: "pointer",
  onHover: { backgroundColor: colors.superLight },
});

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
  color: colors.darkPrimary,
});

style.class(cls.rowChevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  // transition: css.transition({
  //   transform: timings.itemExpandCollapseDuration,
  //   opacity: 100,
  // }),
  color: colors.mediumPrimary,
  opacity: 0,
  userSelect: "none",

  onHover: {
    color: colors.darkPrimary,
  },
});

style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevron, { opacity: 1 });
