import * as model from "./model";
import { View } from "./view";

export class Controller {
  model = model.initialModel;

  viewRef: View;
  constructor() {
    this.viewRef = new View({
      toggleTheme: this.toggleTheme,
    });
    this.viewRef.setTheme(this.model.uiOptions.theme);
  }

  toggleTheme = () => {
    this.model = model.toggleTheme(this.model);
    this.viewRef.setTheme(this.model.uiOptions.theme);
  };

  view = () => this.viewRef.view();
}
