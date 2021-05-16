import { AppView } from "./AppView";
import { UiStateModel } from "../model/UserSettingsModel";
import { Tree } from "./tree/Tree";
import { ItemModel } from "../model/ItemModel";

export class App {
  private view: AppView;
  private model = new UiStateModel();

  constructor() {
    this.view = new AppView({
      toggleTheme: this.model.toggleTheme,
    });

    this.model.on("themeChanged", this.view.setTheme);
    this.view.setTheme(this.model.get("theme"));

    this.model.on("isSearchVisibleChanged", this.view.setSearchVisilibity);
    this.view.setSearchVisilibity(this.model.get("isSearchVisible"));

    this.model.on("tabFocusedChanged", this.view.setTabFocused);
    this.view.setTabFocused(this.model.get("tabFocused"));

    document.addEventListener("keydown", this.onKeyDown);
  }

  get container() {
    return this.view.el;
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      this.model.toggleSearchVisibility();
    }
  };

  itemsLoaded = (items: Items) => {
    const home = this.createModel(items["HOME"], items);
    new Tree(home, this.view.mainTab);
  };

  createModel = (item: Item, items: Items): ItemModel => {
    const container = item as ItemContainer;
    return new ItemModel({
      children:
        item.type !== "YTvideo"
          ? item.children.map((id) => this.createModel(items[id], items))
          : [],
      title: item.title,
      type: item.type,
      isOpen: !container.isCollapsedInGallery || false,

      //@ts-expect-error
      image: item.image,
      //@ts-expect-error
      videoId: item.videoId,
    });
  };
}
