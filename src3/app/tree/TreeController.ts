import { renderTitle } from "./treeTitleView";
import * as model from "../model";
import ItemIcon from "./ItemIcon";
import { viewRow, viewChildren } from "./rowView";
import { dom } from "../../browser";

type TreeControllerProps = {
  container: Element;
};

export class TreeController {
  private roots: ItemWithChildrenController[] = [];
  constructor(public props: TreeControllerProps) {}

  focus(rootId: string, items: Items) {
    const { container } = this.props;
    const item = items[rootId];
    container.appendChild(renderTitle(item));

    if (item.type !== "YTvideo") {
      this.roots = ItemWithChildrenController.createForChildren(
        rootId,
        0,
        items
      );

      this.roots.forEach((root) => {
        container.appendChild(root.render());
      });
    }
  }
}

class ItemWithChildrenController {
  private rowIcon: ItemIcon;
  private row: Element;
  private children: ItemWithChildrenController[] = [];

  constructor(public item: Item, items: Items, public level: number) {
    this.rowIcon = new ItemIcon(item);

    this.row = viewRow(
      item,
      { onChevronClick: () => this.onChevronClick() },
      this.rowIcon,
      level
    );

    this.children = model.isOpen(item)
      ? ItemWithChildrenController.createForChildren(item.id, level + 1, items)
      : [];
  }

  onChevronClick() {
    console.log(this);
  }

  hideChildren() {}

  showChildren() {}

  render = (): Node =>
    model.isOpen(this.item)
      ? dom.fragment([
          this.row,
          viewChildren(
            this.children.map((c) => c.render()),
            this.level + 1
          ),
        ])
      : this.row;

  static createForChildren = (itemId: string, level: number, items: Items) =>
    model
      .getChildrenFor(itemId, items)
      .map((item) => new ItemWithChildrenController(item, items, level));
}
