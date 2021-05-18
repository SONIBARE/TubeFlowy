import Events from "../src3/model/Events";
import Model from "../src3/model/Model";
import { AppView } from "./AppView";

class App {
  list = new MyItemCollection();

  counter = 0;
  view: AppView;
  constructor() {
    this.list.init([
      { id: "1", title: "Sample text" },
      { id: "2", title: "Sample test second" },
      { id: "3", title: "Sample text third" },
    ]);
    this.view = new AppView({
      onRemove: this.list.remove,
      addNew: () => this.list.addItem("New Item"),
    });
    this.view.renderItems(this.list.items);
    this.list.on("remove", (options) => this.view.removeAt(options.index));
    this.list.on("add", ({ index, item }) => this.view.addAt(item, index));
  }

  get el() {
    return this.view.el;
  }
}

type MyItemCollectionEvents = {
  add: { item: MyItemModel; index: number };
  remove: { item: MyItemModel; index: number };
};

class MyItemCollection extends Events<MyItemCollectionEvents> {
  items: MyItemModel[] = [];

  init = (items: MyItem[]) => {
    this.items = items.map((i) => new MyItemModel(i));
  };

  remove = (item: MyItemModel) => {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    this.trigger("remove", { index, item });
  };
  addItem = (title: string) => {
    const item = new MyItemModel({
      id: Math.random() + "",
      title,
    });
    const length = this.items.push(item);
    this.trigger("add", { index: length - 1, item });
  };
}

export class MyItemModel extends Model<MyItem> {}

type MyItem = {
  title: string;
  id: string;
};
export default App;
