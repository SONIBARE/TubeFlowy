import Events from "./base/Events";
import Model from "./base/Model";

type ItemAttributes = {
  title: string;
  isOpen: boolean;
  children?: ItemCollection;
  type: string;
  image?: string;
  videoId?: string;
};

export class ItemModel extends Model<ItemAttributes> {
  public parent?: ItemModel;
  setParent = (parent: ItemModel) => (this.parent = parent);

  toggleIsOpen = () => this.set("isOpen", !this.get("isOpen"));

  isEmpty = () => {
    const childs = this.get("children");
    if (childs) return childs.length === 0;
    return true;
  };

  getImageSrc = (): string => {
    const { image, videoId } = this.attributes;
    if (videoId) return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    else if (image) return image;
    else return "";
  };

  isMedia = () => !!this.getImageSrc();

  isRoot = () => !this.parent;

  forEachChild = (action: Action<ItemModel>) => {
    const childs = this.get("children");
    if (childs) childs.forEach(action);
  };

  mapChild = <T>(mapper: Func1<ItemModel, T>): T[] => {
    const childs = this.get("children");
    return childs ? childs.map(mapper) : [];
  };

  getNextItem = (): ItemModel | undefined => {
    const parent = this.parent;
    if (parent) {
      const childCollection = parent.get("children");
      if (childCollection) {
        const index = childCollection.indexOf(this);
        return childCollection.itemAt(index + 1);
      }
    }
  };
}

export type ReadonlyItemModel = Pick<
  ItemModel,
  | "get"
  | "isEmpty"
  | "getImageSrc"
  | "isMedia"
  | "parent"
  | "forEachChild"
  | "getNextItem"
>;

type ItemCollectionEvents = {
  remove: { item: ItemModel; index: number };
  add: { item: ItemModel; index: number };
};

export class ItemCollection extends Events<ItemCollectionEvents> {
  constructor(private items: ItemModel[]) {
    super();
  }

  remove = (item: ItemModel) => {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    this.trigger("remove", { index, item });
  };
  addItem = (item: ItemModel) => {
    const length = this.items.push(item);
    this.trigger("add", { index: length - 1, item });
  };

  forEach = (action: Action<ItemModel>) => this.items.forEach(action);
  map = <T>(mapper: Func1<ItemModel, T>): T[] => this.items.map(mapper);
  indexOf = (item: ItemModel) => this.items.indexOf(item);
  itemAt = (index: number): ItemModel | undefined => this.items[index];

  get length() {
    return this.items.length;
  }
}
