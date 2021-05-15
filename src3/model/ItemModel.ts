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
  attributes: ItemProps;
  constructor(initial: ItemProps) {
    super();
    this.attributes = {
      isOpenAtMain: true,
      ...initial,
    };
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
}
