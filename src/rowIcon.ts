import {
  cls,
  svg,
  circle,
  colors,
  spacings,
  css,
  timings,
  Styles,
  div,
} from "./infra";
import { store } from "./state";
import { focusItem } from "./focuser";

//TODO: consider where to place this method (common with sideScroll.ts)
const isLightCircleTransparent = (item: Item) =>
  store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

export const appendFocusCicrle = (
  item: Item,
  parent: HTMLElement,
  onMouseDown: (e: MouseEvent) => void
): EmptyFunc => {
  if (
    item.type === "YTplaylist" ||
    item.type === "YTchannel" ||
    item.type === "YTvideo"
  ) {
    const unsub = store.addEventListener(
      "itemChanged." + item.id,
      () => undefined
    );
    const image = div({
      classMap: {
        [cls.channelImage]: item.type == "YTchannel",
        [cls.playlistImage]:
          item.type == "YTplaylist" || item.type == "YTvideo",
      },
      events: {
        click: () => item.type == "YTvideo" && store.play(item.id),
        mousedown: onMouseDown,
      },
      draggable: false,
    });
    image.style.setProperty(
      "background-image",
      `url(${store.getImageSrc(item)})`
    );
    parent.appendChild(image);

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
          events: {
            click: () => focusItem(item),
            mousedown: onMouseDown,
          },
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
  padding: 8,
  color: colors.darkPrimary,
});

css.hover(cls.playIcon, {
  color: "purple",
});

const imageSize = spacings.outerRadius * 2;

const imageStyles: Styles = {
  width: imageSize,
  minWidth: imageSize,
  height: imageSize,
  marginRight: spacings.spaceBetweenCircleAndText,
  boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.1)`,
  backgroundSize: "cover",
  backgroundPosition: `50% 50%`,
  cursor: "pointer",
};

css.class(cls.playlistImage, {
  ...imageStyles,
  borderRadius: 4,
});

css.hover(cls.playlistImage, {
  boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5)`,
});

css.class(cls.channelImage, {
  ...imageStyles,
  borderRadius: imageSize,
});

css.hover(cls.channelImage, {
  boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5)`,
});
