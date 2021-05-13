import { renderTitle } from "./treeTitleView";
import ItemIcon from "./ItemIcon";
import { viewRow, updateChevron, RowEvents, viewChildren } from "./rowView";
import { dom } from "../../browser";
import { Store } from "../Store";

type TreeControllerProps = {
  container: Element;
  store: Store;
};

export class TreeController {
  private roots: ItemWithChildrenController[] = [];
  constructor(public props: TreeControllerProps) {}

  focus(rootId: string) {
    const { container, store } = this.props;
    container.innerHTML = ``;
    const item = store.getItem(rootId);
    container.appendChild(renderTitle(item));

    this.roots = ItemWithChildrenController.createForChildren(rootId, store, 0);

    this.roots.forEach((root) => {
      container.appendChild(root.render());
    });
  }
}

class ItemWithChildrenController {
  private rowIcon: ItemIcon;
  private row: Element;
  private childrenContainer?: Element;

  constructor(
    public itemId: string,
    public store: Store,
    public level: number
  ) {
    const item = store.getItem(itemId);
    this.rowIcon = new ItemIcon(item, store);

    const events: RowEvents = { onChevronClick: () => this.onChevronClick() };
    this.row = viewRow(item, events, this.rowIcon, level);
    this.assignChildren();
  }

  static createForChildren = (itemId: string, store: Store, level: number) =>
    store
      .getChildrenIds(itemId)
      .map((itemId) => new ItemWithChildrenController(itemId, store, level));

  public render = (): Node =>
    this.isOpen() ? dom.fragment([this.row, this.childrenContainer]) : this.row;

  private assignChildren = () => {
    const { itemId, store, level } = this;
    const renderChildren = ItemWithChildrenController.createForChildren;
    if (store.isOpen(itemId))
      this.childrenContainer = viewChildren(
        renderChildren(itemId, store, level + 1).map((c) => c.render()),
        level + 1
      );
  };

  private onChevronClick() {
    this.store.toggleItemVisibility(this.itemId);
    this.rowIcon.update(this.store.getItem(this.itemId));
    updateChevron(this.row, this.isOpen());
    if (this.isOpen()) this.showChildren();
    else this.hideChildren();
  }

  private isOpen = () => this.store.isOpen(this.itemId);

  private hideChildren() {
    this.childrenContainer?.remove();
    this.childrenContainer = undefined;
  }

  private showChildren() {
    this.assignChildren();
    if (this.childrenContainer)
      this.row.insertAdjacentElement("afterend", this.childrenContainer);
  }
}
