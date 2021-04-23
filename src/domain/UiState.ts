import { items } from ".";

export default class UiState {
  isShown = false;
  isShownListeners: Func<boolean>[] = [];
  show = () => {
    this.isShown = true;
    this.isShownListeners.forEach((c) => c(this.isShown));
  };
  hide = () => {
    this.isShown = false;
    this.isShownListeners.forEach((c) => c(this.isShown));
  };

  bindToVisilibty = (cb: Func<boolean>) => {
    this.isShownListeners.push(cb);
    cb(this.isShown);
  };

  partFocused: UiPart = "main";
  private partFocusedListeners: Func<UiPart>[] = [];

  focus = (uiPart: UiPart) => {
    this.partFocused = uiPart;
    this.partFocusedListeners.forEach((c) => c(this.partFocused));
  };

  bindToFocus = (cb: Func<UiPart>) => {
    this.partFocusedListeners.push(cb);
    cb(this.partFocused);
  };

  arrowDown = () => {
    if (this.partFocused === "main") {
      if (this.mainTabSelectedItemId)
        this.selectNextItem(this.mainTabSelectedItemId);
      else this.selectFirstChild(this.mainTabFocusedItemId);
    }
  };
  private mainTabSelectedItemId: string | undefined;
  private mainTabFocusedItemId = "HOME";
  private selectFirstChild = (parentId: string) =>
    this.selectItem(items.getFirstChildOf(parentId).id);

  private selectNextItem = (mainItemId: string) => {
    const nextItem = items.getNextItem(items.getItem(mainItemId));
    if (nextItem) this.selectItem(nextItem.id);
  };

  private selectItem = (itemId: string) => {
    this.mainTabSelectedItemId = itemId;
    this.mainTabChangeListeners.forEach((c) => c(this.mainTabSelectedItemId));
  };

  private mainTabChangeListeners: Func<string | undefined>[] = [];
  bindToMainTabSelectionChange = (cb: Func<string | undefined>) => {
    this.mainTabChangeListeners.push(cb);
    if (this.mainTabSelectedItemId) cb(this.mainTabSelectedItemId);
  };
}

//Items traversal
