import * as model from "./model";

export class Store {
  private model = model.initialModel;

  getState = () => this.model;

  toggleTheme = () => (this.model = model.toggleTheme(this.model));

  toggleSearchVisibility = () =>
    (this.model = model.toggleSearchVisibility(this.model));

  setItems = (items: Items) => (this.model = model.setItems(this.model, items));

  getItem = (itemId: string) => model.getItem(itemId, this.model.items);

  getChildrenIds = (itemId: string): string[] => {
    const item = this.getItem(itemId);
    if (item.type === "YTvideo") return [];
    return item.children;
  };

  isOpen = (itemId: string) =>
    model.isOpen(model.getItem(itemId, this.model.items));

  toggleItemVisibility = (itemId: string) => {
    this.model = {
      ...this.model,
      items: model.toggleItemCollapse(itemId, this.model.items),
    };
  };

  getMainFocus = () => this.model.uiOptions.mainFocus;
  setMainFocus = (itemId: string) => {
    const prevFocus = this.getMainFocus();
    this.model = model.setMainFocus(this.model, itemId);
    const nextFocus = this.getMainFocus();
    if (prevFocus != nextFocus && this.onMainFocusChangeCb)
      this.onMainFocusChangeCb(nextFocus);
  };

  //Events
  onMainFocusChangeCb?: Action<string>;
  public onMainFocusChange(cb: Action<string>) {
    this.onMainFocusChangeCb = cb;
  }
}
