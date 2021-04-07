import { cls } from "../infra";
import { items, events } from "../domain";
import { renderTreeView } from ".";

export const focusItem = (item: Item) => {
  items.setFocusItem(item.id);
  const container = findScrollableContainer();
  container.innerHTML = ``;

  renderTreeView(item, container);
  events.dispatchEvent("item-focused", item);
};

const findScrollableContainer = (): HTMLElement =>
  document.getElementsByClassName(cls.rowsContainer)[0]
    .firstChild as HTMLElement;
