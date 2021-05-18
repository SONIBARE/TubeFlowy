import { dom } from "../../browser";
import { ItemModel } from "../../model/ItemModel";
import FocusModel from "../FocusModel";
import ChildrenView from "./views/ChildrenView";
import { ItemView } from "./views/ItemView";
import TreeTitleView from "./views/TreeTitleView";

export class Tree {
  constructor(private el: Element, private focusModel: FocusModel) {
    const mainFocus = this.focusModel.get("mainTabFocusNode");
    if (mainFocus) this.focus(mainFocus);
    focusModel.on("mainTabFocusNodeChanged", this.focus);
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

    console.log(model, rootItems);
    rootItems.forEach((item) => this.el.appendChild(item.container));
  };

  onFocus = (model: ItemModel) =>
    this.focusModel.set("mainTabFocusNode", model);
}

//
//
//
//
//
//
//
type ItemProps = {
  onFocus: Action<ItemModel>;
  model: ItemModel;
  level: number;
};

class Item {
  view: ItemView;
  childrenView: ChildrenView;
  subitems: Item[] = [];
  constructor(public props: ItemProps) {
    const { model, level } = this.props;
    this.view = new ItemView({
      level,
      model,
      chevronClicked: model.toggleIsOpen,

      onFocus: () => props.onFocus(model),
    });
    //handling this memory leak in unsub
    model.on("isOpenChanged", this.onItemOpenChanged);
    this.childrenView = new ChildrenView(level);
    if (model.get("isOpen")) this.renderChildren();
  }

  get container(): Node {
    if (this.props.model.get("isOpen"))
      return dom.fragment([this.view.row, this.childrenView.el]);
    else return this.view.row;
  }

  onItemOpenChanged = () => {
    this.view.updateIcons(this.props.model);
    this.updateChildren(this.props.model.get("isOpen"));
  };

  updateChildren = (isOpen: boolean) => {
    if (isOpen) this.show();
    else {
      this.childrenView.hide();
      this.subitems.forEach((s) => s.unsub());
    }
  };

  unsub = () => {
    this.props.model.off("isOpenChanged", this.onItemOpenChanged);
    this.subitems.forEach((s) => s.unsub());
  };

  show = () => {
    this.renderChildren();
    const insertAfter = this.view.row;
    insertAfter.insertAdjacentElement("afterend", this.childrenView.el);
  };

  renderChildren = () => {
    const model = this.props.model;
    this.subitems = model.mapChild(
      (c) =>
        new Item({
          ...this.props,
          level: this.props.level + 1,
          model: c,
        })
    );

    this.childrenView.render(this.subitems.map((s) => s.container));
  };
}
