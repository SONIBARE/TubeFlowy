import {
  cls,
  colors,
  spacings,
  css,
  Styles,
  dom,
  svg,
  compose,
} from "../infra";
import { events, items } from "../domain";
import * as player from "../player/playerFooter";

export const itemImage = (
  item: Item,
  parent: HTMLElement,
  onMouseDown: (e: MouseEvent) => void
) => {
  const playPauseColor = "white";
  const image = svg.svg(
    {
      className: cls.focusCircleSvg,
      classMap: {
        [cls.channelImage]: item.type == "YTchannel",
        [cls.squareImage]: item.type == "YTplaylist" || item.type == "YTvideo",
      },
      events: {
        click: () => player.playItem(item),
        mousedown: onMouseDown,
      },
      viewBox: "0 0 100 100",
    },
    svg.polygon({
      className: cls.rowCirclePlay,
      points: "40,32 69,50 40,68",
      stroke: playPauseColor,
      fill: playPauseColor,
      strokeWidth: 10,
      strokelinejoin: "round",
    }),
    svg.polygon({
      className: cls.rowCirclePause,
      points: "30,30 45,30 45,70 30,70",
      strokelinejoin: "round",
      strokeWidth: 2,
      stroke: playPauseColor,
      fill: playPauseColor,
    }),
    svg.polygon({
      className: cls.rowCirclePause,
      points: "70,70 55,70 55,30 70,30",
      fill: playPauseColor,
      strokelinejoin: "round",
      strokeWidth: 2,
      stroke: playPauseColor,
    })
  );

  image.style.setProperty(
    "background-image",
    `url(${items.getImageSrc(item)})`
  );
  parent.appendChild(image);

  const assignImageClasses = () =>
    dom.assignClasses(image, {
      classMap: {
        [cls.closedContainerImage]:
          !items.isFolderOpenOnPage(item) &&
          (item.type == "YTplaylist" || item.type == "YTchannel"),
      },
    });

  const updatePlayState = (isPlaying: boolean) => {
    dom.assignClasses(image, {
      classMap: { [cls.focusCircleSvgPlaying]: isPlaying },
    });
  };

  updatePlayState(false);
  assignImageClasses();
  return compose(
    events.addCompoundEventListener(
      "item-collapse",
      item.id,
      assignImageClasses
    ),
    events.addCompoundEventListener("item-play", item.id, updatePlayState)
  );
};

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

css.class(cls.squareImage, {
  ...imageStyles,
  borderRadius: 4,
});

css.parentHover(cls.row, cls.squareImage, {
  boxShadow: `inset 0 0 0 16px rgba(0,0,0,0.2)`,
});
css.class2(cls.focusCircleSvgPlaying, cls.squareImage, {
  boxShadow: `inset 0 0 0 16px rgba(0,0,0,0.2)`,
});

css.class(cls.channelImage, {
  ...imageStyles,
  borderRadius: imageSize,
});

css.hover(cls.channelImage, {
  boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5)`,
});

css.class(cls.closedContainerImage, {
  boxShadow: `0 0 2px 3px ${colors.mediumPrimary}`,
});

css.hover(cls.closedContainerImage, {
  boxShadow: `0 0 2px 3px ${colors.mediumPrimary}, inset 0 0 0 2px rgba(0,0,0,0.5)`,
});
