import { renderTreeView } from "./tab";
import * as globals from "./domain";
import { ItemsStore } from "./ItemsStore";
import PlayerStore from "./PlayerStore";
import { dom, EventsHandler } from "../infra";
import { renderPlayerFooter } from "./player";

const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

export const viewAppShell = (): Node => {
  const events = new EventsHandler<MyEvents>();
  const store = new ItemsStore(events);
  const player = new PlayerStore(events);
  globals.setItems(store);
  globals.setPlayer(player);

  store.itemsLoaded(loadLocalItems());
  store.focusItem("HOME");
  return dom.fragment([renderTreeView(), renderPlayerFooter()]);
};

document.body.appendChild(viewAppShell());
