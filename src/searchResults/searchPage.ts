import { findYoutubeVideos, ResponseItem } from "../api/youtubeRequest";
import { cls, colors, css, debounce, div, fragment } from "../infra";
import { myRow } from "../row";
import { store } from "../state";

export const showSearchPanel = () => {
  container.classList.toggle(cls.searchResultsOpen);
  if (container.classList.contains(cls.searchResultsOpen)) input.focus();
};

let container: HTMLDivElement;
let input: HTMLInputElement;
export const searchResults = () => {
  input = document.createElement("input");
  input.placeholder = "Search";
  const content = div({});

  const search = () => {
    findYoutubeVideos(input.value).then((results) => {
      const items = results.items.map(mapReponseItem);
      store.setSearchItems(items);
      content.innerHTML = ``;
      content.appendChild(fragment(store.getChildrenFor("SEARCH").map(myRow)));
    });
  };
  input.addEventListener("input", debounce(search, 600));
  container = div({ className: cls.searchResults }, input, content);

  return container;
};

css.class(cls.searchResults, {
  borderLeft: `1px solid ${colors.darkPrimary}`,
  gridArea: "rightSidebar",
  width: 0,
  transition: "width 200ms",
  overflowX: "hidden",
  overflowY: "overlay" as any,
});

css.class(cls.searchResultsOpen, {
  width: "calc(100vw / 2)",
});

css.selector(`.${cls.searchResults}::-webkit-scrollbar`, {
  width: 6,
});

css.selector(`.${cls.searchResults}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});

const mapReponseItem = (resItem: ResponseItem): Item => {
  if (resItem.itemType == "video")
    return {
      type: "YTvideo",
      id: resItem.id,
      title: resItem.name,
      videoId: resItem.itemId,
    };
  else if (resItem.itemType == "channel")
    return {
      type: "YTchannel",
      id: resItem.id,
      title: resItem.name,
      channelId: resItem.itemId,
      image: resItem.image,
      isCollapsedInGallery: true,
      children: [],
    };
  else
    return {
      type: "YTplaylist",
      id: resItem.id,
      title: resItem.name,
      playlistId: resItem.itemId,
      image: resItem.image,
      isCollapsedInGallery: true,
      children: [],
    };
};
