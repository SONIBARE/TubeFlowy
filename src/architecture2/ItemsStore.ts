import { EventsHandler } from "../domain/eventHandler";

export class ItemsStore {
  private items: Items = {};

  private focusedId: string = "HOME";

  constructor(private events: EventsHandler<MyEvents>) {}

  //SELECTORS
  getFocusedItem = () => this.getItem(this.focusedId);

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
  isEmpty = (item: Item): boolean =>
    !("children" in item && item.children.length !== 0);

  isNeedsToBeLoaded = (item: Item): boolean =>
    (this.isPlaylist(item) && item.children.length == 0 && !item.isLoading) ||
    (this.isSearch(item) && item.children.length == 0 && !item.isLoading) ||
    (this.isChannel(item) && item.children.length == 0 && !item.isLoading);

  isEmptyAndNoNeedToLoad = (item: Item): boolean =>
    this.isEmpty(item) && !this.isNeedsToBeLoaded(item);

  isRoot = (item: Item) => item.id === "HOME" || item.id === "SEARCH";

  isFolder = (item: Item): item is Folder => {
    return item.type == "folder";
  };
  isPlaylist = (item: Item): item is YoutubePlaylist => {
    return item.type == "YTplaylist";
  };

  isVideo = (item: Item): item is YoutubeVideo => {
    return item.type == "YTvideo";
  };

  isChannel = (item: Item): item is YoutubeChannel => {
    return item.type == "YTchannel";
  };

  isSearch = (item: Item): item is SearchContainer => {
    return item.type == "search";
  };
  getChildrenFor = (itemId: string): Item[] => {
    const item = this.getItem(itemId);
    if ("children" in item) return item.children.map((id) => this.getItem(id));
    else return [];
  };
  getFirstChildOf = (itemId: string) => this.getChildrenFor(itemId)[0];
  getParent = (itemId: string | undefined): ItemContainer | undefined =>
    itemId
      ? (this.getItem(this.findParentId(itemId)) as ItemContainer)
      : undefined;

  findParentId = (childId: string) =>
    Object.keys(this.items).find((parentKey) => {
      const item = this.getItem(parentKey);
      if ("children" in item) return item.children.indexOf(childId) > -1;
    }) as string;

  getItem = (itemId: string): Item => {
    const item = this.items[itemId];
    if (!item) {
      console.error(this.items);
      throw new Error(
        `Can't find item with id '${itemId}' in ItemsStore. See all items in console logs.`
      );
    } else return item;
  };
  getNextItem = (item: Item): Item | undefined => {
    const parent = this.getParent(item.id);
    if (parent) {
      const index = parent.children.indexOf(item.id);
      const id = parent.children[index + 1];
      if (id) return this.getItem(id);
    }
  };
  getPreviousItem = (item: Item): Item | undefined => {
    const parent = this.getParent(item.id);
    if (parent) {
      const index = parent.children.indexOf(item.id);
      const id = parent.children[index - 1];
      if (id) return this.getItem(id);
    }
  };
  getImageSrc = (item: Item): string => {
    if (item.type == "YTvideo")
      return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
    else if ("image" in item) return item.image;
    else return "";
  };

  //EVENTS SUBSCRIPTIONS
  onItemFocus = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-focused", itemId, cb);

  onAnyItemFocus = (cb: ItemCallback) =>
    this.events.addEventListener("item-focused", cb);

  onItemCollapseExpand = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-collapse", itemId, cb);

  onAnyItemClick = (cb: Func<MyEvents["item-click"]>) =>
    this.events.addEventListener("item-click", cb);

  onItemRemoved = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-removed", itemId, cb);

  onItemInsertedAfter = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-insert-after", itemId, cb);

  onItemInsertedInside = (itemId: string, cb: ItemCallback) =>
    this.events.addCompoundEventListener("item-insert-inside", itemId, cb);

  //ACTIONS
  itemsLoaded = (items: Items) => {
    this.items = items;
    //no events for now
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
      this.getItem(itemId)
    );
  };

  itemClick = (item: Item) => {
    this.events.dispatchCompundEvent("item-click", item.id, item);
  };

  removeItem = (item: Item) => {
    const parent = this.getParent(item.id);
    if (parent) {
      parent.children = parent.children.filter((id) => id != item.id);
      this.events.dispatchCompundEvent("item-removed", item.id, item);
    }
  };

  goBack = () => {
    const parentOfFocusedNode = this.getParent(this.focusedId);
    if (parentOfFocusedNode) this.focusItem(parentOfFocusedNode.id);
  };

  //DND ACTIONS
  moveItemAfter = (itemIdToMove: string, itemIdToMoveAfter: string) => {
    const item = this.getItem(itemIdToMove);
    this.removeItem(item);
    const itemToAfterParent = this.getParent(itemIdToMoveAfter);

    if (itemToAfterParent) {
      itemToAfterParent.children = itemToAfterParent.children
        .map((i) => (i === itemIdToMoveAfter ? [i, itemIdToMove] : [i]))
        .flat();
      this.insertAfter(itemIdToMoveAfter, item);
    }
  };
  moveItemBefore = (itemIdToMove: string, itemIdToMoveAfter: string) => {
    const item = this.getItem(itemIdToMove);
    this.removeItem(item);
    const targetItemParent = this.getParent(itemIdToMoveAfter);

    if (targetItemParent) {
      targetItemParent.children = targetItemParent.children
        .map((i) => (i === itemIdToMoveAfter ? [itemIdToMove, i] : [i]))
        .flat();
      const itemAfterIndex =
        targetItemParent.children.indexOf(itemIdToMove) - 1;
      if (itemAfterIndex >= 0) {
        this.insertAfter(targetItemParent.children[itemAfterIndex], item);
      } else {
        this.inserItemInto(targetItemParent, item);
      }
    }
  };

  moveItemInside = (itemIdToMove: string, itemIdToMoveInside: string) => {
    const item = this.getItem(itemIdToMove);
    this.removeItem(item);
    const itemToMoveInside = this.getItem(itemIdToMoveInside);
    this.inserItemInto(itemToMoveInside, item);
  };

  inserItemInto = (itemContainer: Item, itemToInsert: Item) => {
    if (this.isContainer(itemContainer)) {
      itemContainer.children = [itemToInsert.id].concat(itemContainer.children);
      this.insertInside(itemContainer.id, itemToInsert);
    }
  };

  private insertAfter = (itemId: string, item: Item) =>
    this.events.dispatchCompundEvent("item-insert-after", itemId, item);

  private insertInside = (itemId: string, item: Item) =>
    this.events.dispatchCompundEvent("item-insert-inside", itemId, item);
}
