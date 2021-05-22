import { AppView } from "./AppView";
import { uiModel } from "./store";

class App {
  view: AppView;

  constructor() {
    this.view = new AppView({
      toggleTheme: () => null,
    });

    document.addEventListener("keydown", this.onKeyDown);
    uiModel.on("isSearchVisibleChanged", this.view.setSearchVisilibity);
  }

  get el() {
    return this.view.el;
  }

  setText = (val: number) => {
    this.el.textContent = val + "";
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      uiModel.toggleSearchVisibility();
    }
  };
}

export default App;
