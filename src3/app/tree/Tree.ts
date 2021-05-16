import { dom } from "../../browser";
import { ItemModel } from "../../model/ItemModel";
import ChildrenView from "./views/ChildrenView";
import { ItemView } from "./views/ItemView";

export class Tree {
  constructor(public root: ItemModel, private el: Element) {
    root.getChildren().forEach((child) => {
      this.el.appendChild(new Item(child, 0).container);
    });
  }
}

//TODO: probably better to merge Item and ItemChildren
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

    this.children = new ItemChildren(model, level, this.view.row);
  }

  get container(): Node {
    if (this.model.get("isOpen"))
      return dom.fragment([this.view.row, this.children.view.el]);
    else return this.view.row;
  }
}

class ItemChildren {
  view: ChildrenView;
  constructor(
    private model: ItemModel,
    private level: number,
    private renderAfterElemenet: Element
  ) {
    this.view = new ChildrenView(level);
    if (model.get("isOpen")) this.renderChildren();

    //memory leak, use listenTo instead. Try to find this memory leak using tools
    model.on("isOpenChanged", this.updateChildren);
  }

  updateChildren = (isOpen: boolean) => {
    if (isOpen) this.show();
    else this.view.hide();
  };

  show = () => {
    this.renderChildren();
    if (this.renderAfterElemenet.isConnected)
      this.renderAfterElemenet.insertAdjacentElement("afterend", this.view.el);
    else
      console.warn(
        `Tried to append children after a non-connected item. Check show for children of '${this.model.get(
          "title"
        )}'`
      );
  };

  renderChildren = () => {
    const model = this.model;
    const subitems = model
      .getChildren()
      .map((c) => new Item(c, this.level + 1));

    this.view.render(subitems.map((s) => s.container));
  };
}
