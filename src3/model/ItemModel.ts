import Model from "./Model";

type ItemAttributes = {
  title: string;
  isOpen?: boolean;
  children?: ItemModel[];
  type: string;
};

export class ItemModel extends Model<ItemAttributes> {
  toggleIsOpen = () => this.set("isOpen", !this.get("isOpen"));

  getChildren = () => this.get("children") || [];

  isEmpty = () => this.getChildren().length === 0;
}

export type ReadonlyItemModel = Pick<
  ItemModel,
  "get" | "getChildren" | "isEmpty"
>;
