import { focusItem } from "../treeView";
import { cls, colors, css, dom, icons, spacings } from "../infra";
import { events, items } from "../domain";

const sidebarRow = (item: Item): DocumentFragment => {
  const isOpen = items.isOpenAtSidebar(item);
  const hasAnyNonChildren =
    items.getChildrenFor(item.id).filter((i) => i.type !== "YTvideo").length >
    0;

  const onChevronClick = (e: Event) => {
    e.stopPropagation();
    if (items.isContainer(item)) {
      item.isOpenFromSidebar = !item.isOpenFromSidebar;
      container.innerHTML = ``;
      renderLeftSidebarContent();
    }
  };

  const onRowClick = () => focusItem(item);

  return dom.fragment([
    dom.div(
      { className: cls.leftSidebarRow, events: { click: onRowClick } },
      icons.chevron({
        className: cls.leftSidebarChevron,
        classMap: {
          [cls.leftSidebarChevronOpen]: isOpen,
          [cls.leftSidebarChevronHidden]: !hasAnyNonChildren,
        },
        events: { click: onChevronClick },
      }),
      item.title
    ),
    isOpen
      ? renderChildren(
          items.getChildrenFor(item.id).filter((i) => i.type !== "YTvideo")
        )
      : undefined,
  ]);
};

const renderChildren = (items: Item[]) =>
  dom.div(
    { className: cls.leftSidebarRowChildren },
    dom.fragment(items.map(sidebarRow))
  );

let container: HTMLDivElement;
const renderLeftSidebarContent = () =>
  container.appendChild(
    dom.fragment(
      items
        .getRootItems()
        .filter((i) => i.type !== "YTvideo")
        .map(sidebarRow)
    )
  );

export const leftNavigationSidebar = () => {
  container = dom.div({ className: cls.leftSidebar });

  events.addEventListener("items-loaded", renderLeftSidebarContent);
  return container;
};

css.class(cls.leftSidebar, {
  position: "absolute",
  top: spacings.headerHeight,
  bottom: spacings.playerFooterHeight,
  left: 0,
  backgroundColor: "white",
  boxShadow: "2px 2px 2px rgba(0,0,0,0.2)",
  overflow: "hidden",
  paddingTop: 10,
  paddingBottom: 10,
  width: 16,
  transition: "width 200ms",
  overflowY: "overlay" as any,
});

css.selector(`.${cls.leftSidebar}::-webkit-scrollbar`, {
  width: 6,
});

css.selector(`.${cls.leftSidebar}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});

css.hover(cls.leftSidebar, {
  width: 250,
});

css.class(cls.leftSidebarRow, {
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: `0 10px`,
  cursor: "pointer",
});

css.hover(cls.leftSidebarRow, {
  backgroundColor: colors.lightPrimary,
});

css.class(cls.leftSidebarChevron, {
  height: 16,
  width: 16,
  minWidth: 16,
  cursor: "pointer",
  color: colors.mediumPrimary,
});

css.class(cls.leftSidebarChevronOpen, {
  transform: "rotateZ(90deg)",
});

css.class(cls.leftSidebarChevronHidden, {
  pointerEvents: "none",
  opacity: 0,
});

css.hover(cls.leftSidebarChevron, {
  color: colors.darkPrimary,
});

css.class(cls.leftSidebarRowChildren, {
  marginLeft: 10,
});
