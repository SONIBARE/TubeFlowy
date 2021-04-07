import { cls, div, dom, fragment } from "../infra";
import { rowWithChildren } from "./rowWithChildren";
import { viewHighlighter } from "./rowhighlight";
import { items, events } from "../domain";

let container!: HTMLElement;

export const renderTreeView = () => {
  container = div({ className: cls.rowsScrollContainer });
  return div({ className: cls.rowsContainer }, container, viewHighlighter());
};

export const focusItem = (item: Item) => {
  items.setFocusItem(item.id);

  dom.setChildren(container, renderTreeViewContent(item));
  events.dispatchEvent("item-focused", item);
};

const renderTreeViewContent = (nodeFocused: Item) =>
  dom.fragment([
    viewTitle(nodeFocused),
    fragment(items.getChildrenFor(nodeFocused.id).map(rowWithChildren)),
  ]);

const viewTitle = (item: Item) =>
  !items.isRoot(item)
    ? div(
        {
          className: cls.pageTitle,
          testId: "page-title",
          contentEditable: true,
          events: {
            input: ({ currentTarget }) => {
              items.setTitle(item, currentTarget.textContent || "");
            },
          },
        },
        item.title
      )
    : undefined;
