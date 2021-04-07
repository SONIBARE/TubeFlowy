import { cls, div, fragment } from "./infra";
import { items, events } from "./domain";
import { rowWithChildren } from "./treeView/rowWithChildren";
import { viewHighlighter } from "./treeView/rowhighlight";

export const focusItem = (item: Item) => {
  focusWithoutAnimation(item);
};

const focusWithoutAnimation = (item: Item) => {
  items.setFocusItem(item.id);
  const container = findScrollableContainer();
  container.innerHTML = ``;
  if (item.id !== "HOME")
    container.appendChild(
      div(
        {
          className: cls.pageTitle,
          contentEditable: true,
          events: {
            input: ({ currentTarget }) => {
              items.setTitle(item, currentTarget.textContent || "");
            },
          },
        },
        item.title
      )
    );
  container.appendChild(
    fragment(items.getChildrenFor(item.id).map(rowWithChildren))
  );
  container.appendChild(viewHighlighter());
  events.dispatchEvent("item-focused", item);
};

const findScrollableContainer = (): HTMLElement =>
  document.getElementsByClassName(cls.rowsContainer)[0]
    .firstChild as HTMLElement;
