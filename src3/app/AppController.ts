import { TreeController } from "./tree/TreeController";
import { AppView } from "./AppView";
import { UiStateModel } from "../model/UserSettingsModel";

export class App {
  view: AppView;
  private model = new UiStateModel();
  // mainTabController: TreeController;

  constructor() {
    this.view = new AppView({
      toggleTheme: this.model.toggleTheme,
    });
    // this.mainTabController = new TreeController({
    //   container: this.viewRef.mainTab,
    //   store: this.store,
    // });
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
    // this.store.setItems(items);
    //TODO: get focus from Persisted state
    // this.mainTabController.focus(this.store.getMainFocus());
  };
}
