import { dom } from "../../src3/browser";
import CounterModel from "./state/Counter";
class App {
  el: HTMLElement;
  counter = new CounterModel({ value: 0 });

  constructor() {
    this.el = dom.div({
      testId: "counter",
      onClick: this.counter.increment,
    });
    this.setText(this.counter.get("value"));
    this.counter.on("valueChanged", this.setText);
  }

  setText = (val: number) => {
    this.el.textContent = val + "";
  };
}

export default App;
