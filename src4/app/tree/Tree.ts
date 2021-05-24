import { ItemModel } from "../../model/ItemModel";
// import FocusModel from "../FocusModel";
import TreeTitleView from "./views/TreeTitleView";
import Item from "./Item";

export class Tree {
  constructor(private el: Element) {
    // const mainFocus = this.focusModel.get("mainTabFocusNode");
    // if (mainFocus) this.focus(mainFocus);
    // focusModel.on("mainTabFocusNodeChanged", this.focus);
  }

  focus = (model: ItemModel) => {
    this.el.innerHTML = ``;
    if (!model.isRoot())
      this.el.appendChild(new TreeTitleView(model.get("title")).el);

    const rootItems = model.mapChild(
      (child) =>
        new Item({
          level: 0,
          model: child,
          onFocus: this.onFocus,
        })
    );

    rootItems.forEach((item) => this.el.appendChild(item.container));
  };

  onFocus = (model: ItemModel) => null;
  // this.focusModel.set("mainTabFocusNode", model);
}
