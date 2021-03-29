import { items, events } from "../domain";
import { focusItem } from "../focuser";
import {
  loadUserSettings,
  PersistedState,
  saveUserSettings,
} from "./loginService";

export const saveState = () => {
  const persisted: PersistedState = createPersistedState();
  saveUserSettings(persisted, "nLHkgavG6YXJWlP4YkzJ9t4zW692");
};

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

  const count = (items: Items) => Object.keys(items).length;
  console.log(
    `Saving to backend ${count(homeNodes)} (from ${items.getItemsCount()})`
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

export const loadRemoteState = () => {
  loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((data) => {
    const loadedItems: Items = JSON.parse(data.itemsSerialized);
    items.itemsLoaded(loadedItems);
    focusItem(loadedItems[data.selectedItemId]);
  });
};
