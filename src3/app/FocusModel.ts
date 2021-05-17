import { ItemModel } from "../model/ItemModel";
import Model from "../model/Model";

type FocusState = {
  mainTabFocusNode: ItemModel;
  searchTabFocusNode?: ItemModel;
};
class FocusModel extends Model<FocusState> {}

export default FocusModel;
