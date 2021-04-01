import { events } from "./events";
import { LoadingItemsReponse } from "../api/youtube";

let items: Items = {};
let itemIdFocused = "HOME";

export const itemsLoaded = (newItems: Items) => {
  items = newItems;
  items["SEARCH"] = {
    type: "search",
    title: "Search",
    children: [],
    id: "SEARCH",
    searchTerm: "",
  };
  events.dispatchEvent("items-loaded", items);
};

export const itemLoaded = (parentId: string, response: LoadingItemsReponse) => {
  const parent = items[parentId];
  const responseItems = response.items;
  if (isContainer(parent)) {
    if (parent.type === "YTchannel" || parent.type == "YTplaylist")
      parent.nextPageToken = response.nextPageToken;

    parent.children = responseItems.map((i) => i.id);

    responseItems.forEach((i) => (items[i.id] = i));
  }
};

export const setFocusItem = (itemId: string) => (itemIdFocused = itemId);

export const setSearchItems = (searchResults: Item[]) => {
  (items["SEARCH"] as SearchContainer).children = searchResults.map(
    (i) => i.id
  );

  searchResults.forEach((item) => (items[item.id] = item));
};

export const getRootItems = (): Item[] => getChildrenFor("HOME");

export const getFocusChildren = (): Item[] => getChildrenFor(itemIdFocused);

export const getRoot = (): Item => items["HOME"];

export const getFocusedItem = (): Item => items[itemIdFocused];

export const getItem = (id: string): Item => items[id];

export const getItemsCount = (): number => Object.keys(items).length;

export const getChildrenFor = (itemId: string) => {
  const focused = items[itemId] as Folder;
  return focused.children.map((id) => items[id]);
};

export const getImageSrc = (item: Item): string => {
  if (item.type == "YTvideo")
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else if ("image" in item) return item.image;
  else return "";
};

export const toggleFolderVisibility = (itemId: string) => {
  const item = items[itemId];
  if (item.type !== "YTvideo") {
    item.isCollapsedInGallery = !item.isCollapsedInGallery;
    events.dispatchCompundEvent("item-collapse", itemId, item);
  }
};

//check duplicated for moveItemInside
export const createNewItemAfter = (insertAfter: string): Item => {
  const newItem: Item = {
    id: Math.random() + "",
    type: "folder",
    title: "",
    children: [],
    isCollapsedInGallery: true,
  };
  items[newItem.id] = newItem;
  moveItemAfter(newItem.id, insertAfter);
  return newItem;
};

export const redrawCanvas = () => {
  events.dispatchEvent("redraw-canvas", undefined);
};

export const removeItem = (item: Item) => {
  const parentId = findParentId(item.id);
  const parent = items[parentId];
  if (isContainer(parent)) {
    parent.children = parent.children.filter((id) => id != item.id);
  }
  delete items[item.id];
};
export const setTitle = (item: Item, title: string) => {
  item.title = title;
};

//DND
export const moveItemAfter = (
  itemIdToMove: string,
  itemIdToMoveAfter: string
) => {
  const itemToMoveParent = getParent(itemIdToMove);
  const itemToAfterParent = getParent(itemIdToMoveAfter);
  if (itemToMoveParent) {
    itemToMoveParent.children = itemToMoveParent.children.filter(
      (id) => id != itemIdToMove
    );
    itemChildrenChanged(itemToMoveParent);
  }
  if (itemToAfterParent) {
    itemToAfterParent.children = itemToAfterParent.children
      .map((i) => (i === itemIdToMoveAfter ? [i, itemIdToMove] : [i]))
      .flat();
    itemChildrenChanged(itemToAfterParent);
  }
};

export const moveItemBefore = (
  itemIdToMove: string,
  itemIdToMoveBefore: string
) => {
  const itemToMoveParent = getParent(itemIdToMove);
  const itemToBeforeParent = getParent(itemIdToMoveBefore);
  if (itemToMoveParent && itemToBeforeParent) {
    itemToMoveParent.children = itemToMoveParent.children.filter(
      (id) => id != itemIdToMove
    );
    itemToBeforeParent.children = itemToBeforeParent.children
      .map((i) => (i === itemIdToMoveBefore ? [itemIdToMove, i] : [i]))
      .flat();
    itemChildrenChanged(itemToBeforeParent);
    itemChildrenChanged(itemToMoveParent);
  }
};

export const moveItemInside = (
  itemIdToMove: string,
  itemIdToMoveInside: string
) => {
  const itemToMoveParent = getParent(itemIdToMove);
  const itemToMoveInside = items[itemIdToMoveInside] as ItemContainer;
  if (itemToMoveParent && itemToMoveInside) {
    itemToMoveParent.children = itemToMoveParent.children.filter(
      (id) => id != itemIdToMove
    );
    itemToMoveInside.children = [itemIdToMove].concat(
      itemToMoveInside.children
    );
    itemChildrenChanged(itemToMoveInside);
    itemChildrenChanged(itemToMoveParent);
  }
};

const itemChildrenChanged = (item: Item) =>
  events.dispatchCompundEvent("item-children-length-changed", item.id, item);

//SELECTORS
export const getFistVideoInside = (
  itemId: string
): YoutubeVideo | undefined => {
  let res: YoutubeVideo | undefined;
  const findVideo = (itemId: string) => {
    const children: Item[] = getChildrenFor(itemId);
    children.forEach((c) => {
      if (res) return;
      if (isVideo(c)) res = c;
      else findVideo(c.id);
    });
  };
  getChildrenFor(itemId);
  findVideo(itemId);
  return res;
};

export const findParentId = (childId: string) =>
  Object.keys(items).find((parentKey) => {
    const item = items[parentKey];
    if ("children" in item) return item.children.indexOf(childId) > -1;
  }) as string;

export const getParent = (
  itemId: string | undefined
): ItemContainer | undefined =>
  itemId ? (items[findParentId(itemId)] as ItemContainer) : undefined;

export const getNodePath = (nodeId: string): Item[] => {
  const path: Item[] = [];
  let parentId = nodeId;
  while (parentId) {
    path.push(items[parentId]);
    parentId = findParentId(parentId);
  }
  path.reverse();
  return path;
};

export const isOpenAtSidebar = (item: Item) =>
  isContainer(item) &&
  (typeof item.isOpenFromSidebar != "undefined"
    ? item.isOpenFromSidebar
    : false);

export const isNeedsToBeLoaded = (item: Item): boolean =>
  (isPlaylist(item) && item.children.length == 0 && !item.isLoading) ||
  (isSearch(item) && item.children.length == 0 && !item.isLoading) ||
  (isChannel(item) && item.children.length == 0 && !item.isLoading);

export const isFolder = (item: Item): item is Folder => {
  return item.type == "folder";
};
export const isPlaylist = (item: Item): item is YoutubePlaylist => {
  return item.type == "YTplaylist";
};

export const isVideo = (item: Item): item is YoutubeVideo => {
  return item.type == "YTvideo";
};

export const isChannel = (item: Item): item is YoutubeChannel => {
  return item.type == "YTchannel";
};

export const isSearch = (item: Item): item is SearchContainer => {
  return item.type == "search";
};

export const isFolderOpenOnPage = (item: Item) =>
  isContainer(item) && !item.isCollapsedInGallery;

export const isContainer = (item: Item): item is ItemContainer => {
  return (
    item.type == "YTchannel" ||
    item.type == "folder" ||
    item.type == "search" ||
    item.type == "YTplaylist"
  );
};

export const hasImagePreview = (item: Item): boolean =>
  item.type === "YTplaylist" ||
  item.type === "YTchannel" ||
  item.type === "YTvideo";

export const isEmptyAndNoNeedToLoad = (item: Item) => {
  if ("children" in item) return item.children.length === 0;
  return true;
};
