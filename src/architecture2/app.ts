import { EventsHandler } from "../domain/eventHandler";
import { MyEvents } from "./events";
import { renderTreeView } from "./treeView2";
import * as globals from "./domain";
import { ItemsStore } from "./ItemsStore";
import PlayerStore from "./PlayerStore";

const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

export const viewAppShell = (): HTMLElement => {
  const events = new EventsHandler<MyEvents>();
  const store = new ItemsStore(events);
  const player = new PlayerStore(events);
  globals.setItems(store);
  globals.setPlayer(player);

  store.itemsLoaded(loadLocalItems());
  store.focusItem("HOME");
  return renderTreeView();
};

document.body.appendChild(viewAppShell());
