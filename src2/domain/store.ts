import * as obs from "../infra/observable";
import * as core from "./uiState";
import * as items from "./items";
export { TabName } from "./uiState";

//Responsibilities of a Store is to accept UI events,
//call core and call corresponding change events
export default class Store {
  private uiState = core.initialUiState;
  public itemsState = items.initialState;

  public onSearchVisibilityChange = obs.source(
    () => this.uiState.isSearchVisible
  );
  public onTabFocus = obs.source(() => this.uiState.tabFocused);
  public mainTabFocus = obs.source(() => this.itemsState["HOME"]);

  toggleSearchVisibility = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onSearchVisibilityChange.change();
    this.onTabFocus.change();
  };

  focusOnMain = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onTabFocus.change();
  };

  setItems = (items: Items) => (this.itemsState = items);

  public itemCollapse = obs.keyedSource((key) => {
    const item = this.itemsState[key];
    if (item.type !== "YTvideo") return !!item.isCollapsedInGallery;
    return false;
  });

  toggleIsItemCollapse(itemId: string) {
    this.itemsState = items.toggleItemCollapse(itemId, this.itemsState);
    this.itemCollapse.change(itemId);
  }

  public onThemeChange = obs.source(() => this.uiState.theme);
  toggleTheme = () => {
    this.uiState = core.toggleTheme(this.uiState);
    this.onThemeChange.change();
  };
}
