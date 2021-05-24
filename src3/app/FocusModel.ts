import { ItemModel } from "../model/ItemModel";
import Model from "../model/Model";

type FocusState = {
  mainTabFocusNode?: ItemModel;
  searchTabFocusNode?: ItemModel;
};
class FocusModel extends Model<FocusState> {
  constructor() {
    super({});
  }

  focusOn = (item: ItemModel) => this.set("mainTabFocusNode", item);
}

export default FocusModel;
