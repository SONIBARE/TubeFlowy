import { button, css, div, spacings, cls, ids, zIndexes } from "../infra";
import { items, events } from "../domain";
import { play } from "./youtubePlayer";

//move this to a store
export let itemIdBeingPlayed: string = "";
let isYoutubePlayerShown = true;
let footer: HTMLElement;
let toggleButton: HTMLButtonElement;
export const playerFooter = () => {
  footer = div({
    className: cls.playerFooter,
    classMap: { [cls.yotuubePlayerhidden]: !isYoutubePlayerShown },
  });
  return footer;
};

export const playItem = (item: Item) => {
  const player = document.getElementById(ids.youtubeIframe);
  if (!player) {
    toggleButton = button({
      text: isYoutubePlayerShown ? "hide" : "show",
      events: { click: onPlayerToggleClicked },
    });
    footer.appendChild(toggleButton);
    footer.appendChild(div({ id: ids.youtubeIframe }));
  }

  itemIdBeingPlayed = item.id;
  events.dispatchCompundEvent("item-play", item.id, item);
  if (item.type === "YTvideo") {
    play(item.videoId);
  }
};

export const isItemPlaying = (item: Item) => {};

const onPlayerToggleClicked = () => {
  isYoutubePlayerShown = !isYoutubePlayerShown;
  if (isYoutubePlayerShown) {
    footer.classList.remove(cls.yotuubePlayerhidden);
    toggleButton.textContent = "hide";
  } else {
    toggleButton.textContent = "show";
    footer.classList.add(cls.yotuubePlayerhidden);
  }
};

export const playNextTrack = () => {
  if (itemIdBeingPlayed) {
    const parentItem = items.getParent(itemIdBeingPlayed);
    if (parentItem) {
      const index = parentItem.children.indexOf(itemIdBeingPlayed);
      if (index < parentItem.children.length - 1) {
        const nextItem = parentItem.children[index + 1];
        const item = items.getItem(nextItem);
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
  right: 20,
  bottom: spacings.playerFooterHeight + 20,
  width: 400,
  height: 150,
  opacity: 1,
  transform: "translate3d(0, 0, 0)",
  transition: "opacity 200ms ease-out, transform 200ms ease-out",
  zIndex: zIndexes.iframePlayer,
});

css.parentChildId(cls.yotuubePlayerhidden, ids.youtubeIframe, {
  transform: "translate3d(0, 20px, 0)",
  opacity: 0,
  pointerEvents: "none",
});

css.class(cls.playerFooter, {
  gridArea: "player",
  height: spacings.playerFooterHeight,
  backgroundColor: "#F2F2F2",
  borderTop: "1px solid #CECECE",
  boxSizing: "border-box",
  zIndex: zIndexes.playerFooter,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: 10,
});
