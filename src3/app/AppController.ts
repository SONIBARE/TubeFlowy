import { TreeController } from "./tree/TreeController";
import { Store } from "./Store";
import { AppView } from "./AppView";

export class AppController {
  viewRef: AppView;
  mainTabController: TreeController;

  constructor(public store: Store) {
    this.viewRef = new AppView({
      toggleTheme: this.toggleTheme,
    });
    this.mainTabController = new TreeController({
      container: this.viewRef.mainTab,
      store,
    });
    this.updateTheme();
    document.addEventListener("keydown", this.onKeyDown);
  }

  toggleTheme = () => {
    this.store.toggleTheme();
    this.updateTheme();
  };

  updateTheme = () =>
    this.viewRef.setTheme(this.store.getState().uiOptions.theme);

  view = () => this.viewRef.view();

  onKeyDown = (e: KeyboardEvent) => {
    const prevUi = this.store.getState().uiOptions;
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      this.store.toggleSearchVisibility();
    }

    const { uiOptions } = this.store.getState();

    if (prevUi.isSearchVisible != uiOptions.isSearchVisible)
      this.viewRef.setSearchVisilibity(uiOptions.isSearchVisible);

    if (prevUi.tabFocused != uiOptions.tabFocused)
      this.viewRef.setTabFocused(uiOptions.tabFocused);
  };

  itemsLoaded = (items: Items) => {
    this.store.setItems(items);
    this.mainTabController.focus("HOME", items);
  };
}
