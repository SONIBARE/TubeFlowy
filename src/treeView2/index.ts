import { cls, colors, css, div, dom } from "../infra";
import { items } from "../domain";
import ItemView from "./ItemView";

//VIEW

class TabView {
  constructor(public itemId: string) {}
  render() {
    const item = items.getItem(this.itemId);
    return dom.div(
      {
        className: cls.treeTab,
      },
      dom.div(
        {
          className: [cls.pageTitle, "level_0" as any],
        },
        item.title
      ),
      ItemView.viewItemChildren(item)
    );
  }
}

export const renderTreeView = (): HTMLElement => {
  return div({ className: cls.treeTabContainer }, new TabView("HOME").render());
};

css.class(cls.treeTabContainer, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "stretch",
});

css.class(cls.treeTab, {
  flex: 1,
  height: "100vh",
  overflowY: "overlay" as any,
});
css.class(cls.pageTitle, {
  fontSize: 40,
  fontWeight: "bold",
  marginTop: 20,
});

css.selector(`.${cls.treeTab}::-webkit-scrollbar`, {
  width: 8,
});

css.selector(`.${cls.treeTab}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
});
