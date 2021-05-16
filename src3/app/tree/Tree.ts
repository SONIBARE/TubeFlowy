import { dom } from "../../browser";
import { ItemModel } from "../../model/ItemModel";
import ChildrenView from "./views/ChildrenView";
import { ItemView } from "./views/ItemView";

export class Tree {
  constructor(public root: ItemModel, private el: Element) {
    this.focusOn(root);
  }

  focusOn = (model: ItemModel) => {
    model.getChildren().forEach((child) => {
      this.el.appendChild(new Item(child, 0).container);
    });
  };
}

//
//
//
//
//
//
//
class Item {
  view: ItemView;
  childrenView: ChildrenView;
  subitems: Item[] = [];
  constructor(public model: ItemModel, public level: number) {
    this.view = new ItemView({
      level,
      model,
      chevronClicked: model.toggleIsOpen,
    });
    //handling this memory leak in unsub
    model.on("isOpenChanged", this.onItemOpenChanged);
    this.childrenView = new ChildrenView(level);
    if (model.get("isOpen")) this.renderChildren();
  }

  get container(): Node {
    if (this.model.get("isOpen"))
      return dom.fragment([this.view.row, this.childrenView.el]);
    else return this.view.row;
  }

  onItemOpenChanged = () => {
    this.view.updateIcons(this.model);
    this.updateChildren(this.model.get("isOpen"));
  };

  updateChildren = (isOpen: boolean) => {
    if (isOpen) this.show();
    else {
      this.childrenView.hide();
      this.subitems.forEach((s) => s.unsub());
    }
  };

  unsub = () => {
    this.model.off("isOpenChanged", this.onItemOpenChanged);
    this.subitems.forEach((s) => s.unsub());
  };

  show = () => {
    this.renderChildren();
    const insertAfter = this.view.row;
    insertAfter.insertAdjacentElement("afterend", this.childrenView.el);
  };

  renderChildren = () => {
    const model = this.model;
    this.subitems = model.getChildren().map((c) => new Item(c, this.level + 1));

    this.childrenView.render(this.subitems.map((s) => s.container));
  };
}
