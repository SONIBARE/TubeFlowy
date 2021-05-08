type Items = {
  [key: string]: Item;
};

type Item = ItemContainer | YoutubeVideo;

type ItemContainer =
  | YoutubePlaylist
  | YoutubeChannel
  | Folder
  | SearchContainer;

type CommonItemProperties = {
  id: string;
  title: string;
};

type CommonContainerProperties = {
  //these common properties consume Firebase storage
  //consider maybe reducing their name length
  children: string[];
  isOpenFromSidebar?: boolean;
  isCollapsedInGallery?: boolean;
};

type Folder = {
  type: "folder";
} & CommonItemProperties &
  CommonContainerProperties;

type SearchContainer = {
  type: "search";
  searchTerm: string;
  isLoading?: boolean;
  nextPageToken?: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubePlaylist = {
  type: "YTplaylist";
  playlistId: string;
  isLoading?: boolean;
  nextPageToken?: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeChannel = {
  type: "YTchannel";
  channelId: string;
  isLoading?: boolean;
  nextPageToken?: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeVideo = {
  type: "YTvideo";
  videoId: string;
} & CommonItemProperties;

export const initialState: Items = {
  HOME: {
    id: "HOME",
    title: "Home",
    type: "folder",
    children: ["1", "2"],
  },
  "1": {
    id: "1",
    title: "One",
    type: "folder",
    children: ["1.1", "1.2"],
  },
  "1.1": {
    id: "1.1",
    title: "One child 1",
    type: "folder",
    children: [],
  },
  "1.2": {
    id: "1.2",
    title: "One child 2",
    type: "folder",
    children: [],
  },
  "2": {
    id: "2",
    title: "Two",
    type: "folder",
    children: [],
  },
};

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
