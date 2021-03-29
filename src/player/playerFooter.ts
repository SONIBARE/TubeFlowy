import { css, div, spacings } from "../infra";
import { cls, ids, zIndexes } from "../infra/keys";
import { store, getParent } from "../state";
import { play } from "./youtubePlayer";

//move this to a store
let itemIdBeingPlayed: string = "";
export const playerFooter = () => {
  const container = div({ className: cls.playerFooter });
  store.addEventListener("item-play", (item) => {
    if (!container.firstChild)
      container.appendChild(div({ id: ids.youtubeIframe }));

    if (item.type === "YTvideo") {
      itemIdBeingPlayed = item.id;
      play(item.videoId);
    }
  });
  return container;
};

export const playNextTrack = () => {
  if (itemIdBeingPlayed) {
    const parentItem = getParent(store.items, itemIdBeingPlayed);
    if (parentItem) {
      const index = parentItem.children.indexOf(itemIdBeingPlayed);
      if (index < parentItem.children.length - 1) {
        const nextItem = parentItem.children[index + 1];
        const item = store.items[nextItem];
        if (item.type == "YTvideo") {
          itemIdBeingPlayed = item.id;
          play(item.videoId);
        }
      }
    }
  }
};

css.id(ids.youtubeIframe, {
  position: "fixed",
  right: "20px",
  bottom: spacings.playerFooterHeight + 20 + "px",
  width: "400px",
  height: "150px",
  opacity: 1,
  transform: "translate3d(0, 0, 0)",
  transition: "opacity 200ms ease-out, transform 200ms ease-out",
  zIndex: zIndexes.iframePlayer,
});

css.class(cls.playerFooter, {
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: "#F2F2F2",
  borderTop: "1px solid #CECECE",
  boxSizing: "border-box",
  zIndex: zIndexes.playerFooter,
});
