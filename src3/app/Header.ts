import { ItemModel } from "../model/ItemModel";
import FocusModel from "./FocusModel";
import HeaderView from "./HeaderView";

class Header {
  view: HeaderView;
  constructor(container: Element, private focusModel: FocusModel) {
    this.view = new HeaderView({
      container,
      focusOn: (m) => focusModel.focusOn(m as ItemModel),
    });
    focusModel.on("mainTabFocusNodeChanged", this.updateHeader);

    const mainFocus = this.focusModel.get("mainTabFocusNode");
    if (mainFocus) this.updateHeader(mainFocus);
  }

  init = (rootModel: ItemModel) => {
    this.view.initHeader(rootModel);
  };

  updateHeader = (model: ItemModel) => {
    const path = [];
    let current: ItemModel | undefined = model;
    while (current) {
      path.push(current);
      current = current.parent;
    }
    //remove root item, HOME is show via icon
    path.pop();
    this.view.renderPath(path.reverse());
  };
}

export default Header;
