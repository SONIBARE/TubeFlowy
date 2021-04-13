import { cls, colors, css, div, dom } from "../infra";
import { events, items } from "../domain";
import ItemView from "./ItemView";

//VIEW

class TabView {
  tab: HTMLElement;
  constructor() {
    this.tab = dom.div({
      className: cls.treeTab,
    });
    events.addEventListener("item-focused", this.renderTabContent);
    this.renderTabContent(items.getFocusedItem());
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
      ItemView.viewItemChildren(itemFocused)
    );
  };
  render() {
    return this.tab;
  }

  cleanup = () => {
    events.removeEventCb("item-focused", this.renderTabContent);
  };
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

const numberOfLevelsToGenerate = 21;

const TREE_MAX_WIDTH = 700;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  css.text(`
    .level_${level}{
        padding-left: calc(max((100% - ${TREE_MAX_WIDTH}px) / 2, 20px) + ${
    level * 20
  }px);
    }
`);
}

css.class(cls.treeRow, {
  cursor: "pointer",
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
});

css.hover(cls.treeRow, {
  backgroundColor: colors.superLight,
});

css.class(cls.itemGalleryContent, {
  overflowX: "overlay" as any,
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  paddingBottom: 20,
});

css.class(cls.box, {
  height: 30,
  backgroundColor: colors.darkPrimary,
  marginTop: 20,
  marginLeft: 20,
  color: "white",
});

css.class(cls.lastBox, {
  height: "100%",
  width: 20,
});

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar`, {
  height: 8,
});

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});
