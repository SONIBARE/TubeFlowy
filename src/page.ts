import { renderTreeView } from "./tab";
import * as domain from "./domain";
import { cls, css, dom, EventsHandler } from "./infra";
import { renderPlayerFooter } from "./player";
import { loadLocalItems } from "./stateLoader";
import ItemView from "./tab/ItemView";
import { items } from "./domain";

const search = () =>
  dom.div(
    {
      id: "search",
      className: [cls.treeTab, cls.searchHidden],
    },
    ItemView.viewItemChildren(items.getItem("SEARCH"), 0)
  );

export const viewAppShell = (): Node => {
  const events = new EventsHandler<MyEvents>();
  domain.init(events);

  domain.items.itemsLoaded(loadLocalItems());
  domain.items.focusItem("HOME");
  return dom.div({ className: cls.tabsContainer }, renderTreeView(), search());
};

css.class(cls.tabsContainer, {
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
});

css.class(cls.treeTabContainer, {
  flex: 1,
});

css.class(cls.treeTab, {
  flex: 1,
  height: "100vh",
  overflowY: "overlay" as any,
});
