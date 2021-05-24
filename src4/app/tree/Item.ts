import { dom } from "../../infra";
import { ItemModel } from "../../model/ItemModel";
// import FocusModel from "../FocusModel";
import ChildrenView from "./views/ChildrenView";
import { ItemView } from "./views/ItemView";

type ItemProps = {
  onFocus: Action<ItemModel>;
  model: ItemModel;
  level: number;
};

export default class Item {
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

  onItemOpenChanged = (isOpen: boolean) => {
    this.view.updateIcons(this.props.model);
    this.updateChildren(isOpen);
  };

  updateChildren = (isOpen: boolean) => {
    if (isOpen) this.show();
    else {
      this.childrenView.hide();
      this.unlistenToChildCollectionUpdates();
      this.subitems.forEach((s) => s.unsub());
    }
  };

  unsub = () => {
    this.props.model.off("isOpenChanged", this.onItemOpenChanged);
    this.subitems.forEach((s) => s.unsub());
    this.unlistenToChildCollectionUpdates();
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
    this.listenToChildCollectionUpdates();
  };

  listenToChildCollectionUpdates = () => {
    const childCollection = this.props.model.get("children")!;
    if (childCollection) childCollection.on("remove", this.onRemoveChild);
  };

  unlistenToChildCollectionUpdates = () => {
    const childCollection = this.props.model.get("children")!;
    if (childCollection) childCollection.off("remove", this.onRemoveChild);
  };

  onRemoveChild = (options: { item: ItemModel; index: number }) => {
    const { item, index } = options;
    console.log("removing ", item, index);
  };
}
