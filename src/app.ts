import { renderTreeView } from "./tab";
import * as domain from "./domain";
import { dom, EventsHandler } from "./infra";
import { renderPlayerFooter } from "./player";

const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

export const viewAppShell = (): Node => {
  const events = new EventsHandler<MyEvents>();
  domain.init(events);

  domain.items.itemsLoaded(loadLocalItems());
  domain.items.focusItem("HOME");
  return dom.fragment([renderTreeView(), renderPlayerFooter()]);
};

document.body.appendChild(viewAppShell());
