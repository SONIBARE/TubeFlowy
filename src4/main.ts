import { dom } from "../src3/browser";
import { ItemModel } from "./model/ItemModel";
// import * as firebase from "../src3/api/firebase";

// firebase.initFirebase(() => {
//   firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
//     const res: Items = JSON.parse(state.itemsSerialized);
//     localStorage.setItem("items:v3", state.itemsSerialized);
//   });
// });

const items = localStorage.getItem("items:v3");
const parsed: Items = items ? JSON.parse(items) : {};

const h: ItemContainer = parsed["HOME"] as ItemContainer;

const home = new ItemModel({
  title: "Home",
  children: h.children.map(
    (cid) => new ItemModel({ children: [], title: parsed[cid].title })
  ),
});

class Tree {
  el = dom.div({});
  constructor(public root: ItemModel) {
    this.renderItem(root, 0);
  }

  renderItem = (item: ItemModel, level: number) => {
    this.el.appendChild(new ItemView(item, level).container);
    item.getChildren().forEach((i) => this.renderItem(i, level + 1));
  };
}

class ItemView {
  build: ReturnType<typeof assemble>;
  constructor(public model: ItemModel, public level: number) {
    this.build = assemble();
    this.build.toggle.addEventListener("click", this.model.toggleIsOpen);
    model.on("isOpenChanged", this.updateChevron);
    this.render();
  }

  render() {
    this.updateTitle();
    this.updateChevron();
  }

  updateTitle = () => {
    this.build.title.textContent = this.model.getTitle();
  };

  updateChevron = () => {
    this.build.toggle.textContent = this.model.isOpen() ? "-" : "+";
  };
  get container() {
    return this.build.row;
  }
}

const assemble = () => {
  const toggle = dom.button({ text: "+/-" });
  const title = dom.span({ text: "Here goes title" });
  const row = dom.div({ children: [toggle, title] });
  return { toggle, title, row };
};

document.body.appendChild(new Tree(home).el);
