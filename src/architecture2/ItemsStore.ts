import { EventsHandler } from "../domain/eventHandler";
import { MyEvents } from "./events";

type ItemCallback = (item: Item) => void;

export class ItemsStore {
  items: Items = {};

  focusedId: string = "HOME";

  constructor(private events: EventsHandler<MyEvents>) {}

  //SELECTORS
  getFocusedItem = () => this.items[this.focusedId];

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

  getChildrenFor = (itemId: string): Item[] => {
    const item = this.items[itemId];
    if ("children" in item) return item.children.map((id) => this.items[id]);
    else return [];
  };

  //EVENTS
  onItemFocus = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-focused", itemId, cb);

  onAnyItemFocus = (cb: ItemCallback) =>
    this.events.addEventListener("item-focused", cb);

  onItemCollapseExpand = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-collapse", itemId, cb);

  //ACTIONS
  itemsLoaded = (items: Items) => {
    this.items = items;
  };

  toggleItemVisibility = (item: Item) => {
    if (item.type !== "YTvideo") {
      item.isCollapsedInGallery = !item.isCollapsedInGallery;
      this.events.dispatchCompundEvent("item-collapse", item.id, item);
    }
  };

  focusItem = (itemId: string) => {
    this.focusedId = itemId;
    this.events.dispatchCompundEvent(
      "item-focused",
      itemId,
      this.items[itemId]
    );
  };
}
