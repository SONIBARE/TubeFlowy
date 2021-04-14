import { EventsHandler } from "../domain/eventHandler";
import { MyEvents } from "./events";
import { ItemsStore } from "./ItemsStore";
import { renderTreeView } from "./treeView2";

const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

export const viewAppShell = (): HTMLElement => {
  const events = new EventsHandler<MyEvents>();
  const store = new ItemsStore(events);
  store.itemsLoaded(loadLocalItems());
  store.focusItem("HOME");
  return renderTreeView(store);
};

document.body.appendChild(viewAppShell());
