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

  toggleSearchVisibility = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onSearchVisibilityChange.notifyListeners();
    this.onTabFocus.notifyListeners();
  };

  focusOnMain = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onTabFocus.notifyListeners();
  };

  setItems = (items: Items) => {
    this.itemsState = items;
    this.onMainTabNodeFocusChange.notifyListeners();
  };

  public onMainTabNodeFocusChange = obs.source(() => "HOME");

  public itemOpen = obs.keyedSource((key) =>
    items.getItem(key, this.itemsState)
  );

  toggleIsItemCollapse(itemId: string) {
    this.itemsState = items.toggleItemCollapse(itemId, this.itemsState);
    this.itemOpen.change(itemId);
  }

  public onThemeChange = obs.source(() => this.uiState.theme);
  toggleTheme = () => {
    this.uiState = core.toggleTheme(this.uiState);
    this.onThemeChange.notifyListeners();
  };
}
