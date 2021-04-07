import { items, events } from "../domain";
import { focusItem } from "../treeView/focuser";
import {
  loadUserSettings,
  PersistedState,
  saveUserSettings,
} from "./loginService";

const createPersistedState = (): PersistedState => {
  const homeNodes: Items = {};
  const traverse = (id: string) => {
    const item = items.getItem(id);
    homeNodes[id] = item;
    if (items.isContainer(item) && item.children.length > 0) {
      item.children.forEach(traverse);
    }
  };
  traverse("HOME");

  const savingCount = items.getItemsCount(homeNodes);
  const actualCount = items.getItemsCount();
  console.log(
    `Saving ${savingCount} items (currently in state ${actualCount} items)`
  );

  //selected node might be removed, in that case point to a HOME
  const currentSelectedId = items.getFocusedItem().id;
  const persistedItemId = homeNodes[currentSelectedId]
    ? currentSelectedId
    : "HOME";
  return {
    focusedStack: [],
    itemsSerialized: JSON.stringify(homeNodes),
    selectedItemId: persistedItemId,
  };
};

const dataVersion = "v1";
const dataKey = "tubeflowyData:" + dataVersion;

export const saveState = () => {
  const persisted: PersistedState = createPersistedState();

  if (window.location.host.startsWith("localhost")) {
    console.log(`Saving to localStorage ${dataVersion}`);
    localStorage.setItem(dataKey, JSON.stringify(persisted));
  } else {
    saveUserSettings(persisted, "nLHkgavG6YXJWlP4YkzJ9t4zW692");
  }
};

export const loadRemoteState = () => {
  const localData = localStorage.getItem(dataKey);

  const onDataReady = (data: PersistedState) => {
    const loadedItems: Items = JSON.parse(data.itemsSerialized);
    items.itemsLoaded(loadedItems);
    focusItem(loadedItems[data.selectedItemId]);
  };

  if (localData) {
    console.log(`Loaded from localStorage ${dataVersion}`);
    const parsed = JSON.parse(localData) as PersistedState;
    Promise.resolve().then(() => onDataReady(parsed));
  } else {
    loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then(onDataReady);
  }
};
