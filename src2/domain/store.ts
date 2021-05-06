import * as obs from "../infra/observable";
import * as core from "./core";
export { TabName } from "./core";

//Responsibilities of a Store is to accept UI events,
//call core and call corresponding change events
export default class Store {
  private uiState = core.initialUiState;

  public onSearchVisibilityChange = obs.source(
    () => this.uiState.isSearchVisible
  );
  public onTabFocus = obs.source(() => this.uiState.tabFocused);

  toggleSearchVisibility = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onSearchVisibilityChange.change();
    this.onTabFocus.change();
  };

  focusOnMain = () => {
    this.uiState = core.toggleSEarchVisibility(this.uiState);
    this.onTabFocus.change();
  };
}
