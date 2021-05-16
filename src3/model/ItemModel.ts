import Model from "./Model";

type ItemAttributes = {
  title: string;
  isOpen: boolean;
  children?: ItemModel[];
  type: string;
  image?: string;
  videoId?: string;
};

export class ItemModel extends Model<ItemAttributes> {
  public parent?: ItemModel;
  setParent = (parent: ItemModel) => (this.parent = parent);

  toggleIsOpen = () => this.set("isOpen", !this.get("isOpen"));

  getChildren = () => this.get("children") || [];

  isEmpty = () => this.getChildren().length === 0;

  getImageSrc = (): string => {
    const { image, videoId } = this.attributes;
    if (videoId) return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    else if (image) return image;
    else return "";
  };

  isMedia = () => !!this.getImageSrc();
}

export type ReadonlyItemModel = Pick<
  ItemModel,
  "get" | "getChildren" | "isEmpty" | "getImageSrc" | "isMedia" | "parent"
>;
