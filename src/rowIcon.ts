import {
  cls,
  svg,
  circle,
  colors,
  icons,
  spacings,
  css,
  timings,
} from "./infra";

import { store } from "./state";
import { focusItem } from "./focuser";
import { play } from "./player/youtubePlayer";

//TODO: consider where to place this method (common with sideScroll.ts)
const isLightCircleTransparent = (item: Item) =>
  store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

export const appendFocusCicrle = (
  item: Item,
  parent: HTMLElement
): EmptyFunc => {
  if (item.type === "YTvideo") {
    const unsub = store.addEventListener(
      "itemChanged." + item.id,
      () => undefined
    );

    parent.appendChild(
      icons.play({
        className: [cls.focusCircleSvg, cls.playIcon],
        onClick: () => play(item.videoId),
      })
    );
    return unsub;
  } else {
    const lightCircle = circle({
      className: cls.lightCircle,
      cx: spacings.outerRadius,
      cy: spacings.outerRadius,
      r: spacings.outerRadius,
      fill: colors.lightPrimary,
    });

    const animateLightCircle = (item: Item) => {
      if (isLightCircleTransparent(item))
        lightCircle.classList.add(cls.transparent);
      else lightCircle.classList.remove(cls.transparent);
    };

    parent.appendChild(
      svg(
        {
          onClick: () => focusItem(item),
          className: cls.focusCircleSvg,
          viewBox: `0 0 ${spacings.outerRadius * 2} ${
            spacings.outerRadius * 2
          }`,
        },
        lightCircle,
        circle({
          className: cls.outerCircle,
          cx: spacings.outerRadius,
          cy: spacings.outerRadius,
          r: spacings.outerRadius,
          fill: colors.mediumPrimary,
        }),
        circle({
          cx: spacings.outerRadius,
          cy: spacings.outerRadius,
          r: spacings.innerRadius,
          fill: colors.darkPrimary,
        })
      )
    );

    const unsub = store.addEventListener(
      "itemChanged." + item.id,
      animateLightCircle
    );
    animateLightCircle(item);
    return unsub;
  }
};

//FOCUS CIRCLES

css.class(cls.focusCircleSvg, {
  marginRight: spacings.spaceBetweenCircleAndText,
  cursor: "pointer",
  width: spacings.outerRadius * 2,
  minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
});

css.class(cls.outerCircle, {
  opacity: 0,
  transition: "transform 100ms",
  transform: "scale(0.5)",
  transformOrigin: "50%",
});

css.parentHover(cls.focusCircleSvg, cls.outerCircle, {
  transform: "scale(1)",
  opacity: 1,
});

css.class(cls.lightCircle, {
  opacity: 1,
  transition: `opacity ${timings.cardExpandCollapseDuration}ms`,
});

css.class(cls.transparent, {
  opacity: 0,
});

css.class(cls.playIcon, {
  padding: 5,
  color: colors.darkPrimary,
});

css.hover(cls.playIcon, {
  color: "purple",
});
