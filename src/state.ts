import { EventsHandler } from "./infra";

class Store {
  items: Items = {};
  itemIdFocused: string = "HOME";

  events = new EventsHandler<Item>();
  setItems = (i: Items) => {
    this.items = i;
  };

  getRootItems = (): Item[] => this.getChildrenFor("HOME");

  getFocusChildren = (): Item[] => this.getChildrenFor(this.itemIdFocused);

  getRoot = (): Item => this.items["HOME"];

  getChildrenFor = (itemId: string) => {
    const focused = this.items[itemId] as Folder;
    return focused.children.map((id) => this.items[id]);
  };

  getImageSrc = (item: Item): string => {
    if (item.type == "YTvideo")
      return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
    else if ("image" in item) return item.image;
    else return "";
  };

  toggleFolderVisibility = (itemId: string) => {
    const item = this.items[itemId];
    if (item.type !== "YTvideo") {
      item.isCollapsedInGallery = !item.isCollapsedInGallery;
      this.events.dispatchEvent("itemChanged." + itemId, item);
      this.events.dispatchEvent("itemChanged", item);
    }
  };

  isFolderOpenOnPage = (item: Item) =>
    this.isContainer(item) && !item.isCollapsedInGallery;

  isContainer = (item: Item): item is ItemContainer => {
    return (
      item.type == "YTchannel" ||
      item.type == "folder" ||
      item.type == "search" ||
      item.type == "YTplaylist"
    );
  };

  isEmptyAndNoNeedToLoad = (item: Item) => {
    if ("children" in item) return item.children.length === 0;
    return true;
  };

  redrawCanvas = () => {
    this.events.dispatchEvent("redrawMinimap", undefined as any);
  };

  addEventListener = (eventName: string, cb: Func<Item>): EmptyFunc =>
    this.events.addEventListener(eventName, cb);

  removeEventListener = (eventName: string, cb: Func<Item>) =>
    this.events.removeEventListener(eventName, cb);
}

export const store = new Store();

//@ts-expect-error
global.store = store;
