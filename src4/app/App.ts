import { ItemModel, ItemCollection } from "../model/ItemModel";
import { UiStateModel } from "../model/UserSettingsModel";
import { AppView } from "./AppView";
import { Tree } from "./tree/Tree";

class App {
  view: AppView;
  val = 1;
  home?: ItemModel;
  static uiModel: UiStateModel;
  constructor() {
    this.view = new AppView({
      toggleTheme: () => null,
    });

    App.uiModel = new UiStateModel();
    App.uiModel.on("isSearchVisibleChanged", this.view.setSearchVisilibity);
    document.addEventListener("keydown", this.onKeyDown);
  }

  //used only in  testing, not expecting to unmount App for now in prod
  cleanup() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  get el() {
    return this.view.el;
  }

  setText = (val: number) => {
    this.el.textContent = val + "";
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      App.uiModel.toggleSearchVisibility();
    }
  };
  itemsLoaded = (items: Items) => {
    const home = App.createModel(items["HOME"], items);
    const tree = new Tree(this.view.mainTab);
    tree.focus(home);
    // this.renderItems(home);
    // this.header.init(home);
    // this.focusModel.set("mainTabFocusNode", home);
    // addRootItemModelToMemoryLeakDetector(home);
    // this.mainTree = new Tree(this.view.mainTab, this.focusModel);
  };

  static createModel = (item: Item, items: Items): ItemModel => {
    const container = item as ItemContainer;
    const model = new ItemModel({
      children:
        item.type !== "YTvideo"
          ? new ItemCollection(
              item.children.map((id) => App.createModel(items[id], items))
            )
          : undefined,
      title: item.title,
      type: item.type,
      isOpen: !container.isCollapsedInGallery || false,

      //@ts-expect-error
      image: item.image,
      //@ts-expect-error
      videoId: item.videoId,
    });
    model.forEachChild((child) => child.setParent(model));
    return model;
  };
}

export default App;
