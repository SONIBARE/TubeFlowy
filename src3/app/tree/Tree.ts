import { dom } from "../../browser";
import { ItemModel } from "../../model/ItemModel";
import { ItemView } from "./ItemView";

export class Tree {
  el = dom.div({});

  constructor(public root: ItemModel) {
    root.getChildren().forEach((child) => {
      this.el.appendChild(new Item(child, 0).container);
    });
  }
}

class Item {
  view: ItemView;
  childItems: Item[] | undefined;
  constructor(public model: ItemModel, public level: number) {
    this.view = new ItemView({
      level,
      model,
      chevronClicked: model.toggleIsOpen,
    });
    model.on("isOpenChanged", () => this.view.updateIcons(model));

    if (model.isOpen())
      this.childItems = model.getChildren().map((c) => new Item(c, level + 1));
  }

  get container(): Node {
    if (this.childItems)
      return dom.fragment([
        this.view.row,
        ...this.childItems.map((c) => c.container),
      ]);
    else return this.view.row;
  }
}
