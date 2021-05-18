import { dom } from "../src3/browser";
import { MyItemModel } from "./App";

export type ViewProps = {
  onRemove: Action<MyItemModel>;
  addNew: EmptyAction;
};
export class AppView {
  el = dom.div({});
  rows: Element[] = [];

  constructor(private props: ViewProps) {}

  renderItems = (items: MyItemModel[]) => {
    this.el.innerHTML = ``;
    this.rows = items.map(this.viewItem);
    this.rows.forEach((row) => this.el.appendChild(row));
    this.el.appendChild(
      dom.button({ text: "add", testId: "addNew", onClick: this.props.addNew })
    );
  };

  removeAt = (index: number) => {
    this.rows[index].remove();
    this.rows.splice(index, 1);
  };

  addAt = (item: MyItemModel, index: number) => {
    //TODO: can't always push to the end, check index instead
    const row = this.viewItem(item);
    const last = this.rows[this.rows.length - 1];
    this.rows.push(row);
    last.insertAdjacentElement("afterend", row);
  };

  viewItem = (item: MyItemModel) =>
    dom.div({
      testId: "item-row",
      children: [
        dom.span({ text: item.get("title"), testId: "title" }),
        dom.button({
          text: "X",
          testId: "remove",
          onClick: () => this.props.onRemove(item),
        }),
      ],
    });
}
