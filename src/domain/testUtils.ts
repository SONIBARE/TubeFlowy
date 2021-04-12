export const folder = (id: string, children?: string[]): Folder => ({
  id: id,
  title: id + " Title",
  type: "folder",
  children: children || [],
  isCollapsedInGallery: true,
});

export const video = (id: string, videoId: string): YoutubeVideo => ({
  id: id,
  title: id,
  type: "YTvideo",
  videoId,
});

export const createItemsFromArray = (items: Item[]): Items =>
  items.reduce((items, item) => {
    items[item.id] = item;
    return items;
  }, {} as Items);

export const deepCopy = <T>(i: T): T => JSON.parse(JSON.stringify(i));
