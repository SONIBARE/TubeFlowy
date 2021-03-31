import { cls, colors, spacings, css, Styles, dom, div } from "../infra";
import { events, items } from "../domain";
import * as player from "../player/playerFooter";

export const itemImage = (
  item: Item,
  parent: HTMLElement,
  onMouseDown: (e: MouseEvent) => void
) => {
  const image = div({
    events: {
      click: () => player.playItem(item),
      mousedown: onMouseDown,
    },
    draggable: false,
  });
  image.style.setProperty(
    "background-image",
    `url(${items.getImageSrc(item)})`
  );
  parent.appendChild(image);

  const assignImageClasses = () =>
    dom.assignClasses(image, {
      classMap: {
        [cls.channelImage]: item.type == "YTchannel",
        [cls.squareImage]: item.type == "YTplaylist" || item.type == "YTvideo",
        [cls.closedContainerImage]:
          !items.isFolderOpenOnPage(item) &&
          (item.type == "YTplaylist" || item.type == "YTchannel"),
      },
    });

  assignImageClasses();
  return events.addCompoundEventListener(
    "item-collapse",
    item.id,
    assignImageClasses
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

css.hover(cls.squareImage, {
  boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5)`,
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
