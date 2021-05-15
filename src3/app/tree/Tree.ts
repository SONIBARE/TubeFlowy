import { dom, cls } from "../../browser";
import { ItemModel } from "../../model/ItemModel";
import { ItemView } from "./ItemView";

export class Tree {
  constructor(public root: ItemModel, private el: Element) {
    root.getChildren().forEach((child) => {
      this.el.appendChild(new Item(child, 0).container);
    });
  }
}

class Item {
  view: ItemView;
  children: ItemChildren;
  constructor(public model: ItemModel, public level: number) {
    this.view = new ItemView({
      level,
      model,
      chevronClicked: model.toggleIsOpen,
    });
    model.on("isOpenChanged", () => this.view.updateIcons(model));

    this.children = new ItemChildren(model, this);
  }

  get container(): Node {
    if (this.model.isOpen())
      return dom.fragment([this.view.row, this.children.el]);
    else return this.view.row;
  }
}

class ItemChildren {
  el = dom.div({ className: cls.rowChildren });
  constructor(private model: ItemModel, private parentItem: Item) {
    if (model.isOpen()) this.renderChildren();

    model.on("isOpenChanged", this.updateChildren);
  }

  updateChildren = (isOpen: boolean) => {
    if (isOpen) this.show();
    else this.hide();
  };

  show = () => {
    this.renderChildren();
    if (this.parentItem.view.row.isConnected)
      this.parentItem.view.row.insertAdjacentElement("afterend", this.el);
    else
      console.warn(
        `Tried to append children after a non-connected item. Check show for children of '${this.model.getTitle()}'`
      );
  };

  renderChildren = () =>
    this.model
      .getChildren()
      .forEach((c) =>
        this.el.appendChild(new Item(c, this.parentItem.level + 1).container)
      );

  hide = () => {
    this.el.remove();
    this.el.innerHTML = ``;
  };
}
