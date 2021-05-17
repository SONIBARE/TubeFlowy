import { AppView } from "./AppView";
import { UiStateModel } from "../model/UserSettingsModel";
import { Tree } from "./tree/Tree";
import { ItemModel } from "../model/ItemModel";
import Player from "../player/Player";
import { addRootItemModelToMemoryLeakDetector } from "../tests/callbackWatcher";
import FocusModel from "./focusModel";
import Header from "./Header";
import Search from "./Search";
import Dnd from "./Dnd";

export class App {
  public header: Header;
  public view: AppView;
  public player: Player;
  public search: Search;
  public dnd: Dnd;
  mainTree?: Tree;
  private model = new UiStateModel();

  public focusModel = new FocusModel();
  //Yes, singleton, I know, I'm a bad person.
  //But I do not want to pass a lot of props to items to call Player events
  //maybe global event bus would be much better
  static instance: App;
  constructor() {
    App.instance = this;
    this.view = new AppView({
      toggleTheme: this.model.toggleTheme,
    });
    this.player = new Player(this.view.footer);
    this.search = new Search({
      container: this.view.searchTab,
      model: this.model,
      focusModel: this.focusModel,
    });
    this.dnd = new Dnd(this.view.el);
    console.log(this.focusModel);
    this.header = new Header(this.view.header, this.focusModel);
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
    const home = App.createModel(items["HOME"], items);
    this.header.init(home);
    this.focusModel.set("mainTabFocusNode", home);
    addRootItemModelToMemoryLeakDetector(home);
    this.mainTree = new Tree(this.view.mainTab, this.focusModel);
  };

  static createModel = (item: Item, items: Items): ItemModel => {
    const container = item as ItemContainer;
    const model = new ItemModel({
      children:
        item.type !== "YTvideo"
          ? item.children.map((id) => App.createModel(items[id], items))
          : [],
      title: item.title,
      type: item.type,
      isOpen: !container.isCollapsedInGallery || false,

      //@ts-expect-error
      image: item.image,
      //@ts-expect-error
      videoId: item.videoId,
    });
    model.getChildren().forEach((child) => child.setParent(model));
    return model;
  };
}
