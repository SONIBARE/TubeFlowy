import { store } from "../state";
import { PersistedState } from "./loginService";

export const createPersistedState = (): PersistedState => {
  const homeNodes: Items = {};
  const traverse = (id: string) => {
    const item = store.items[id];
    homeNodes[id] = item;
    if (store.isContainer(item) && item.children.length > 0) {
      item.children.forEach(traverse);
    }
  };
  traverse("HOME");

  const count = (items: Items) => Object.keys(items).length;
  console.log(
    `Saving to backend ${count(homeNodes)} (from ${count(store.items)})`
  );

  //selected node might be removed, in that case point to a HOME
  const selectedItemId = homeNodes[store.itemIdFocused]
    ? store.itemIdFocused
    : "HOME";
  return {
    focusedStack: [],
    itemsSerialized: JSON.stringify(homeNodes),
    selectedItemId,
  };
};
