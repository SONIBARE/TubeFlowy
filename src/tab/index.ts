import { cls, colors, compose, css, dom, spacings } from "../infra";
import ItemView from "./ItemView";
import { items } from "../domain";
import { RowHighliter } from "./RowHighlighterr";

//VIEW

class TabView {
  tab: HTMLElement;
  constructor() {
    const rowHighlighter = new RowHighliter();
    const cleanup = items.onAnyItemFocus(this.renderTabContent);
    this.tab = dom.div({
      className: cls.treeTab,
      onRemovedFromDom: compose(cleanup, rowHighlighter.cleanup),
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
  return dom.div({ className: cls.treeTabContainer }, new TabView().render());
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
  marginLeft: spacings.chevronSize + 2,
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
