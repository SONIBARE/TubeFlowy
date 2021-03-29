import { items } from "../domain";
import { PersistedState } from "./loginService";

export const createPersistedState = (): PersistedState => {
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
