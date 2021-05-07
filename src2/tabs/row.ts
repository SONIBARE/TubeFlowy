import { store } from "../domain";
import * as items from "../domain/items";
import { cls, colors, css, dom, style } from "../infra";
import ItemIcon from "./ItemIcon";

const viewRow = (item: Item, level: number) => {
  const icon = new ItemIcon(item);
  return dom.div({
    classNames: [cls.row, css.classForLevel(level)],
    children: [
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
});

style.hover(cls.row, {
  backgroundColor: colors.superLight,
});

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
});
