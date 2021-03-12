import { EventsHandler } from "./infra";

class Store {
  items: Items = {};
  events = new EventsHandler<Item>();
  setItems = (i: Items) => {
    this.items = i;
  };

  getRootItems = (): Item[] => this.getChildrenFor("HOME");

  getChildrenFor = (itemId: string) => {
    const focused = this.items[itemId] as Folder;
    return focused.children.map((id) => this.items[id]);
  };

  toggleFolderVisibility = (itemId: string) => {
    const folder = this.items[itemId] as Folder;
    folder.isCollapsedInGallery = !folder.isCollapsedInGallery;
    this.events.dispatchEvent("itemChanged." + itemId, folder);
  };

  isFolderOpenOnPage = (item: Item) => !!(item as any).isCollapsedInGallery;

  isEmptyAndNoNeedToLoad = (item: Item) => {
    if ("children" in item) return item.children.length === 0;
    return true;
  };

  addEventListener = (eventName: string, cb: Func<Item>) =>
    this.events.addEventListener(eventName, cb);

  removeEventListener = (eventName: string, cb: Func<Item>) =>
    this.events.removeEventListener(eventName, cb);
}

export const store = new Store();

//@ts-expect-error
global.store = store;
