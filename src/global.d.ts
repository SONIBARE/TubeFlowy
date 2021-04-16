type valueof<T> = T[keyof T];
type Func<T> = (a: T) => void;
type EmptyFunc = () => void;

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

//DND
type DropPlacement = "before" | "after" | "inside";

type ItemCallback = (item: Item) => void;

type Func<T1> = (arg: T1) => void;
type Func<T1, T2> = (arg1: T1, arg2: T2) => void;
type Func<T1, T2, T3> = (arg1: T1, arg2: T2, arg2: T3) => void;

//EVENTS
type MyEvents = {
  "items-loaded": Items;

  "item-collapse": Item;
  "item-focused": Item;
  "item-play": Item;
  "item-click": Item;

  //CRUD
  "item-removed": Item;
  "item-insert-after": Item;
  "item-insert-inside": Item;
};
