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

  public partFocused: UiPart = "main";
  partFocusedListeners: Func<UiPart>[] = [];

  focus = (uiPart: UiPart) => {
    this.partFocused = uiPart;
    this.partFocusedListeners.forEach((c) => c(this.partFocused));
  };

  bindToFocus = (cb: Func<UiPart>) => {
    this.partFocusedListeners.push(cb);
    cb(this.partFocused);
  };
}
