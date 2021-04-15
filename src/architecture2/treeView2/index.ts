import { cls, colors, css, div, dom, spacings } from "../../infra";
import { ItemsStore } from "../ItemsStore";
import ItemView from "./ItemView";
import { items } from "../domain";

//VIEW

class TabView {
  tab: HTMLElement;
  constructor() {
    const cleanup = items.onAnyItemFocus(this.renderTabContent);
    this.tab = dom.div({
      className: cls.treeTab,
      onRemovedFromDom: cleanup,
    });
    this.renderTabContent(items.getFocusedItem());
  }

  renderTabContent = (itemFocused: Item) => {
    dom.setChildren(
      this.tab,
      dom.div(
        {
          className: [cls.pageTitle, "level_0" as any],
        },
        itemFocused.id !== "HOME"
          ? dom.button({
              text: "<-",
              testId: "go-back",
              events: { click: items.goBack },
            })
          : undefined,

        dom.span({ testId: "page-title" }, itemFocused.title)
      ),
      ItemView.viewItemChildren(itemFocused, 0)
    );
  };
  render() {
    return this.tab;
  }
}

export const renderTreeView = (): HTMLElement => {
  return div({ className: cls.treeTabContainer }, new TabView().render());
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
  marginLeft: spacings.chevronSize,
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
