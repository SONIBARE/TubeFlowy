import * as obs from "../infra/observable";

export default class Store {
  private model = 0;
  public onCounterChange = obs.source(() => this.model);

  public increment = () => {
    this.model += 1;
    this.onCounterChange.change();
  };
}
