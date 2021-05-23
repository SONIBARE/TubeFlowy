import { UiStateModel } from "../model/UserSettingsModel";
import { AppView } from "./AppView";

class App {
  view: AppView;
  val = 1;

  static uiModel: UiStateModel;
  constructor() {
    this.view = new AppView({
      toggleTheme: () => null,
    });

    App.uiModel = new UiStateModel();
    App.uiModel.on("isSearchVisibleChanged", this.view.setSearchVisilibity);
    document.addEventListener("keydown", this.onKeyDown);
  }

  //used only in  testing, not expecting to unmount App for now in prod
  cleanup() {
    document.removeEventListener("keydown", this.onKeyDown);
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
      App.uiModel.toggleSearchVisibility();
    }
  };
}

export default App;
