import { cls, colors, css, div, dom } from "../infra";

const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

const items: Items = loadLocalItems();

const repeat = <T>(item: () => T, times: number): T[] => {
  return Array.from(new Array(times)).map(() => item());
};

//@ts-expect-error
global.items = items;
const renderTab = (itemFocusedId: string) => {
  const rowTitle = (title: string, level: number) =>
    dom.div(
      {
        className: [cls.treeRow, ("level_" + level) as any],
      },
      title
    );

  const renderWebDevelopment = (item: Item, level: number): HTMLElement[] => [
    rowTitle(item.title, level),
    div(
      {
        style: { height: 200, backgroundColor: colors.superLight },
        className: [("level_" + (level + 1)) as any, cls.gallerySubText],
      },
      ...repeat(() => div({ className: cls.box }), 200).concat([
        dom.div({ className: cls.lastBox }),
      ])
    ),
  ];

  const children = (id: string) =>
    dom.div(
      { className: cls.treeRowChildren },

      dom.fragment(
        (items[id] as ItemContainer).children
          .map((id) =>
            items[id].title === "Web Development"
              ? renderWebDevelopment(items[id], 1)
              : [rowTitle(items[id].title, 1)]
          )
          .flat()
      )
    );

  const row = (item: Item) =>
    dom.fragment([rowTitle(item.title, 0), children(item.id)]);

  return dom.div(
    {
      className: cls.treeTab,
    },
    dom.div(
      {
        className: [cls.pageTitle, "level_0" as any],
      },
      items[itemFocusedId].title
    ),
    dom.fragment(
      (items[itemFocusedId] as ItemContainer).children.map((id) =>
        row(items[id])
      )
    )
  );
};

export const renderTreeView = (): HTMLElement => {
  return div({ className: cls.treeTabContainer }, renderTab("HOME"));
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

const numberOfLevelsToGenerate = 21;

const TREE_MAX_WIDTH = 700;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  css.text(`
    .level_${level}{
        padding-left: calc(max((100% - ${TREE_MAX_WIDTH}px) / 2, 0px) + ${
    level * 20
  }px);
    }
`);
}

css.class(cls.treeRowChildren, {
  //   paddingLeft: 20,
});

css.hover(cls.treeRow, {
  backgroundColor: colors.lightPrimary,
});

css.class(cls.pageTitle, {
  fontSize: 40,
  fontWeight: "bold",
  marginTop: 20,
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
});

css.selector(`.${cls.treeTab}::-webkit-scrollbar`, {
  width: 8,
});

css.selector(`.${cls.treeTab}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});

css.class(cls.gallerySubText, {
  overflowX: "overlay" as any,
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  paddingBottom: 20,
});

css.class(cls.box, {
  height: 30,
  width: 100,
  backgroundColor: colors.darkPrimary,
  marginTop: 20,
  marginLeft: 20,
});

css.class(cls.lastBox, {
  height: "100%",
  width: 20,
});

css.selector(`.${cls.gallerySubText}::-webkit-scrollbar`, {
  height: 8,
});

css.selector(`.${cls.gallerySubText}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});
