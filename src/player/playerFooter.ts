import { css, div, spacings } from "../infra";
import { cls, ids, zIndexes } from "../infra/keys";
import { store } from "../state";
import { play } from "./youtubePlayer";

export const playerFooter = () => {
  const container = div({ className: cls.playerFooter });
  store.addEventListener("item-play", (item) => {
    if (!container.firstChild)
      container.appendChild(div({ id: ids.youtubeIframe }));

    if (item.type === "YTvideo") play(item.videoId);
  });
  return container;
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
