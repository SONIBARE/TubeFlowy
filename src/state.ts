import { JavascriptModulesPlugin } from "webpack";
import { PersistedState, saveUserSettings } from "./api/loginService";
import { createPersistedState } from "./api/stateLoader";
import { EventsHandler } from "./infra";

class Store {
  items: Items = {};
  itemIdFocused: string = "HOME";

  events = new EventsHandler<Item>();
  itemsLoaded = (newItems: Items) => {
    this.items = newItems;
    this.items["SEARCH"] = {
      type: "search",
      title: "Search",
      children: [],
      id: "SEARCH",
      searchTerm: "",
    };
    this.events.dispatchEvent("items-loaded", undefined as any);
  };

  setSearchItems = (searchResults: Item[]) => {
    (this.items["SEARCH"] as SearchContainer).children = searchResults.map(
      (i) => i.id
    );

    searchResults.forEach((item) => {
      this.items[item.id] = item;
    });
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

  isOpenAtSidebar = (item: Item) =>
    this.isContainer(item) &&
    (typeof item.isOpenFromSidebar != "undefined"
      ? item.isOpenFromSidebar
      : false);

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

  //Play
  play = (itemId: string) => {
    this.events.dispatchEvent("item-play", this.items[itemId]);
  };

  //Persistance
  save = () => {
    const persisted: PersistedState = createPersistedState();
    saveUserSettings(persisted, "nLHkgavG6YXJWlP4YkzJ9t4zW692");
  };

  addEventListener = (eventName: string, cb: Func<Item>): EmptyFunc =>
    this.events.addEventListener(eventName, cb);

  removeEventListener = (eventName: string, cb: Func<Item>) =>
    this.events.removeEventListener(eventName, cb);
}

export const store = new Store();

//@ts-expect-error
global.store = store;
