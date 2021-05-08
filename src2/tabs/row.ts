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
  //TODO: figure out declarative way to return element and subscription
  const subscription = store.itemOpen.bind(item.id, (item) =>
    dom.updateClass(chevron, cls.rowChevronOpen, items.isOpen(item))
  );
  return chevron;
};

const viewItemWithChildren = (item: Item, level: number) => {
  const icon = new ItemIcon(item);
  const row = dom.div({
    classNames: [cls.row, css.classForLevel(level)],
    children: [
      viewChevron(item),
      icon.svg,
      dom.span({ className: cls.rowTitle, text: item.title }),
    ],
  });
  let children: Element | undefined = items.isOpen(item)
    ? viewItemChildren(item, level)
    : undefined;

  const unsub = store.itemOpen.onChange(item.id, (item) => {
    icon.update(item);
    if (items.isOpen(item)) {
      children = viewItemChildren(item, level);
      row.insertAdjacentElement("afterend", children);
    } else {
      if (children) {
        children.remove();
        children = undefined;
      }
    }
  });
  return dom.fragment([row, children]);
};

export const viewChildren = (itemId: string, level = 0): Node[] =>
  items
    .getChildrenFor(itemId, store.itemsState)
    .map((item) => viewItemWithChildren(item, level));

const viewItemChildren = (item: Item, level: number) =>
  dom.div({
    className: cls.rowChildren,
    children: viewChildren(item.id, level + 1).concat(childrenBorder(level)),
  });

export const childrenBorder = (level: number) =>
  dom.div({
    classNames: [cls.rowChildrenBorder, css.childrenForLevel(level)],
  });

style.class(cls.row, {
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
  cursor: "pointer",
  ...css.paddingVertical(4),
  onHover: {
    themes: {
      light: { backgroundColor: colors.superLight },
      dark: { backgroundColor: "#1E1E24" },
    },
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
  themes: {
    dark: { backgroundColor: colors.darkPrimary },
    light: { backgroundColor: colors.lightPrimary },
  },
});

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
  themes: {
    dark: { color: "white" },
    light: { color: colors.darkPrimary },
  },
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
  color: colors.mediumPrimary,
  opacity: 0,
  userSelect: "none",

  onHover: {
    themes: {
      dark: { color: "white" },
      light: { color: colors.darkPrimary },
    },
  },
});

style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevron, { opacity: 1 });
