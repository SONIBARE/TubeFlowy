import { store } from "../domain";
import * as items from "../domain/items";
import { cls, css, dom, spacings, style } from "../infra";

const viewRow = (item: Item, level: number) =>
  dom.div({
    classNames: [cls.rowTitle, css.classForLevel(level)],
    children: [item.title],
  });

export const viewChildren = (itemId: string, level = 0) =>
  items
    .getChildrenFor(itemId, store.itemsState)
    .map((item) => viewRow(item, level));

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
});
