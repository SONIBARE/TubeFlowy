import { EventsHandler } from "../infra";
import { ui } from "./index";

export default class KeyboardInput {
  constructor(public events: EventsHandler<MyEvents>) {
    document.addEventListener("keydown", this.onKeyDown);
  }

  cleanup = () => document.removeEventListener("keydown", this.onKeyDown);

  onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();
      ui.focus("main");
    }
    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      if (ui.partFocused === "main") {
        ui.show();
        ui.focus("search");
      } else {
        ui.hide();
        ui.focus("main");
      }
    }
  };
}
