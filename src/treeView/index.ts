import { cls, div, dom, css, fragment } from "../infra";
import { rowWithChildren } from "./rowWithChildren";
import { selectItem, viewHighlighter } from "./rowhighlight";
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

export const focusItemAndSelectFirstChild = (item: Item) => {
  focusItem(item);
  const firstChild = items.getFirstChildOf(item.id);
  if (firstChild) selectItem(firstChild);
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

css.class(cls.pageTitle, {
  fontSize: 28,
  marginLeft: 22,
  marginBottom: 5,
  marginTop: 20,
  fontWeight: "bold",
  outline: "none",
});
