import { cls, div, fragment } from "../infra";
import { rowWithChildren } from "./rowWithChildren";
import { viewHighlighter } from "./rowhighlight";
import { items } from "../domain";

export const renderTreeView = (nodeFocused: Item, container: HTMLElement) => {
  if (!items.isRoot(nodeFocused))
    container.appendChild(
      div(
        {
          className: cls.pageTitle,
          contentEditable: true,
          events: {
            input: ({ currentTarget }) => {
              items.setTitle(nodeFocused, currentTarget.textContent || "");
            },
          },
        },
        nodeFocused.title
      )
    );
  container.appendChild(
    fragment(items.getChildrenFor(nodeFocused.id).map(rowWithChildren))
  );
  container.appendChild(viewHighlighter());
};
