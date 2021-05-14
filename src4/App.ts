import { dom } from "../src3/browser";
import Events from "./Events";

type CounterEvents = {
  "change:counter": number;
};
class CounterModel {
  public events = new Events<CounterEvents>();

  public counter = 0;

  public increment = () => {
    this.counter += 1;
    this.events.trigger("change:counter", this.counter);
  };
}

class App {
  private counter = new Counter();

  public container = dom.div({ children: ["Hi there", this.counter.el] });
}

class Counter {
  private model = new CounterModel();
  private counter = dom.span({ text: "" });
  public el = dom.div({
    children: [
      this.counter,
      dom.button({ text: "add", onClick: this.model.increment }),
    ],
  });
  constructor() {
    this.model.events.on("change:counter", this.renderCounter);
    this.renderCounter(this.model.counter);
  }

  //updating view
  renderCounter = (val: number) => (this.counter.textContent = val + "");
}

class CounterView {}

// class CounterView {}

export default App;
