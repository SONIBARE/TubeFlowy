import { SimpleEventListener } from "../infra/events";

export default class Store {
  private model = 0;
  public onIncrement = new SimpleEventListener(() => this.model);

  public increment = () => {
    this.model += 1;
    this.onIncrement.notify();
  };
}
