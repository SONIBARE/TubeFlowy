import Model from "../../../src3/model/Model";

type Props = {
  value: number;
};
export default class CounterModel extends Model<Props> {
  increment = () => this.set("value", this.get("value") + 1);
}
