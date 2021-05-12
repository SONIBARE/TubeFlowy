export type Model = {
  items: Items;
  uiOptions: UIOptions;
};

type UIOptions = {
  theme: Theme;
  isSearchVisible: boolean;
  tabFocused: TabName;
};

export const toggleTheme = (model: Model): Model => ({
  ...model,
  uiOptions: {
    ...model.uiOptions,
    theme: model.uiOptions.theme == "dark" ? "white" : "dark",
  },
});

export const initialModel: Model = {
  items: {},
  uiOptions: {
    theme: "dark",
    isSearchVisible: false,
    tabFocused: "main",
  },
};

export const toggleSearchVisibility = (model: Model): Model => {
  if (model.uiOptions.isSearchVisible) {
    return {
      ...model,
      uiOptions: {
        ...model.uiOptions,
        tabFocused: "main",
        isSearchVisible: false,
      },
    };
  } else
    return {
      ...model,
      uiOptions: {
        ...model.uiOptions,
        tabFocused: "search",
        isSearchVisible: true,
      },
    };
};

export const setItems = (model: Model, items: Items): Model => ({
  ...model,
  items,
});

export const getItem = (itemId: string, items: Items): Item => {
  const item = items[itemId];
  if (!item) {
    console.error(items);
    throw new Error(
      `Can't find item with id '${itemId}' in ItemsStore. See all items in console logs.`
    );
  } else return item;
};

export const getChildrenFor = (itemId: string, items: Items): Item[] => {
  const item = getItem(itemId, items);
  if (isContainer(item)) return item.children.map((id) => getItem(id, items));
  else return [];
};
export const getImageSrc = (item: Item): string => {
  if (item.type == "YTvideo")
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else if ("image" in item) return item.image;
  else return "";
};

export const isOpen = (item: Item) =>
  isContainer(item) && !item.isCollapsedInGallery;

export const isEmptyAndNoNeedToLoad = (item: Item): boolean =>
  isEmpty(item) && !isNeedsToBeLoaded(item);

const isEmpty = (item: Item): boolean =>
  !("children" in item && item.children.length !== 0);

const isNeedsToBeLoaded = (item: Item): boolean =>
  (isPlaylist(item) && item.children.length == 0 && !item.isLoading) ||
  (isSearch(item) && item.children.length == 0 && !item.isLoading) ||
  (isChannel(item) && item.children.length == 0 && !item.isLoading);

const isRoot = (item: Item) => item.id === "HOME" || item.id === "SEARCH";

const isFolder = (item: Item): item is Folder => {
  return item.type == "folder";
};
const isPlaylist = (item: Item): item is YoutubePlaylist => {
  return item.type == "YTplaylist";
};

const isVideo = (item: Item): item is YoutubeVideo => {
  return item.type == "YTvideo";
};

const isChannel = (item: Item): item is YoutubeChannel => {
  return item.type == "YTchannel";
};

const isSearch = (item: Item): item is SearchContainer => {
  return item.type == "search";
};
const isContainer = (item: Item): item is ItemContainer =>
  item.type !== "YTvideo";

export const toggleItemCollapse = (itemId: string, items: Items): Items =>
  mapItemContainer(itemId, items, (item) => ({
    isCollapsedInGallery: !item.isCollapsedInGallery,
  }));

const mapItemContainer = (
  itemId: string,
  items: Items,
  mapper: Func1<ItemContainer, Partial<ItemContainer>>
): Items => {
  const item = getItem(itemId, items);
  //mutate or not mutate - that is the question
  if (isContainer(item)) {
    //@ts-expect-error
    items[item.id] = {
      ...item,
      ...mapper(item),
    };
  }
  return items;
};
