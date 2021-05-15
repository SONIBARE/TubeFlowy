import Events from "./Events";

type ItemProps = {
  title: string;
  isOpenAtMain?: boolean;
  children: ItemModel[];
};

type ItemEvents = {
  titleChanged: string;
  isOpenChanged: boolean;
};

export class ItemModel extends Events<ItemEvents> {
  constructor(private attributes: ItemProps) {
    super();
  }

  getTitle = () => this.attributes.title;
  setTitle = (title: string) => {
    this.attributes.title = title;
    this.trigger("titleChanged", title);
  };

  isOpen = (): boolean => !!this.attributes.isOpenAtMain;
  toggleIsOpen = () => {
    const newValue = !this.attributes.isOpenAtMain;
    if (newValue) this.attributes.isOpenAtMain = newValue;
    else delete this.attributes.isOpenAtMain;

    this.trigger("isOpenChanged", newValue);
  };

  getChildren = () => this.attributes.children;

  //TODO:
  isEmpty = () => this.getChildren().length === 0;
  getType = () => "folder";
  getImage = () => "asd";
}

export type ReadonlyItemModel = Pick<
  ItemModel,
  "getTitle" | "isOpen" | "getChildren" | "isEmpty" | "getType" | "getImage"
>;
