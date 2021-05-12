import * as model from "./model";
import { View } from "./view";

export class Controller {
  model = model.initialModel;

  viewRef: View;
  constructor() {
    this.viewRef = new View({
      toggleTheme: this.toggleTheme,
    });
    this.updateTheme();
    document.addEventListener("keydown", this.onKeyDown);
  }

  toggleTheme = () => {
    this.model = model.toggleTheme(this.model);
    this.updateTheme();
  };

  updateTheme = () => this.viewRef.setTheme(this.model.uiOptions.theme);

  view = () => this.viewRef.view();

  onKeyDown = (e: KeyboardEvent) => {
    const prevUi = this.model.uiOptions;
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      this.model = model.toggleSearchVisibility(this.model);
    }

    const { uiOptions } = this.model;

    if (prevUi.isSearchVisible != uiOptions.isSearchVisible)
      this.viewRef.setSearchVisilibity(uiOptions.isSearchVisible);

    if (prevUi.tabFocused != uiOptions.tabFocused)
      this.viewRef.setTabFocused(uiOptions.tabFocused);
  };

  itemsLoaded = (items: Items) => {
    this.model = model.setItems(this.model, items);
    this.viewRef.focusOnMainTab("HOME", this.model.items);
  };
}
