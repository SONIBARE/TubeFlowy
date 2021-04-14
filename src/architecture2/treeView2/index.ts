import { cls, colors, css, div, dom } from "../../infra";
import { ItemsStore } from "../ItemsStore";
import ItemView from "./ItemView";

//VIEW

class TabView {
  tab: HTMLElement;
  constructor(public store: ItemsStore) {
    const cleanup = store.onAnyItemFocus(this.renderTabContent);
    this.tab = dom.div({
      className: cls.treeTab,
      onRemovedFromDom: cleanup,
    });
    this.renderTabContent(store.getFocusedItem());
  }

  renderTabContent = (itemFocused: Item) => {
    dom.setChildren(
      this.tab,
      dom.div(
        {
          testId: "page-title",
          className: [cls.pageTitle, "level_0" as any],
        },
        itemFocused.title
      ),
      ItemView.viewItemChildren(itemFocused, 0, this.store)
    );
  };
  render() {
    return this.tab;
  }
}

export const renderTreeView = (store: ItemsStore): HTMLElement => {
  return div({ className: cls.treeTabContainer }, new TabView(store).render());
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
