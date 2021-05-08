import {
  cls,
  colors,
  spacings,
  style,
  svg,
  ClassName,
  dom,
  css,
} from "../infra";
import * as items from "../domain/items";
import { Styles } from "../infra/style";

export default class ItemIcon {
  public svg: SVGElement;

  constructor(item: Item) {
    this.svg = this.view(item);
    this.update(item);
  }

  update = (item: Item) => {
    const isMedia = item.type !== "folder";

    if (item.title === "Music") {
      console.log("update", items.isOpen(item));
    }
    dom.assignReadonlyClasses(this.svg, {
      classMap: {
        [cls.rowIconEmpty]: !isMedia && items.isEmptyAndNoNeedToLoad(item),
        [cls.rowIconOpen]:
          !items.isEmptyAndNoNeedToLoad(item) && items.isOpen(item),
        [cls.rowIconClosed]:
          !items.isEmptyAndNoNeedToLoad(item) && !items.isOpen(item),
        // [cls.focusCircleSvgPlaying]: player.isPlayingItem(this.item),
        // [cls.closedContainerImage]:
        //   !items.isFolderOpenOnPage(item) &&
        //   (item.type == "YTplaylist" || item.type == "YTchannel"),
      },
    });
  };

  private view(item: Item) {
    const isMedia = item.type !== "folder";

    return svg.svg({
      className: cls.rowIcon,
      viewBox: "0 0 100 100",
      children: [
        this.createCircleAtCenter(cls.rowCircleEmpty, 19),
        !isMedia
          ? this.createCircleAtCenter(cls.rowCircleOuter, 50)
          : undefined,
        !isMedia
          ? this.createCircleAtCenter(cls.rowCircleFilled, 19)
          : undefined,
        ,
      ],
    });
  }

  createCircleAtCenter = (className: ClassName, r: number) =>
    svg.circle({ cx: 100 / 2, cy: 100 / 2, className, r });
}

style.class(cls.rowIcon, {
  marginRight: spacings.spaceBetweenCircleAndText,
  //   cursor: "pointer",
  width: spacings.outerRadius * 2,
  //   minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
  //   backgroundSize: "cover",
  //   backgroundPosition: `50% 50%`,
  color: colors.darkPrimary,
});

style.class(cls.rowCircleEmpty, {
  fill: "transparent",
  strokeWidth: 2,
  themes: {
    dark: { stroke: "white" },
    light: { stroke: colors.darkPrimary },
  },
  transition: css.transition({ opacity: 200 }),
});

style.class(cls.rowCircleOuter, {
  themes: {
    dark: { fill: colors.darkPrimary },
    light: { fill: colors.lightPrimary },
  },
  transition: css.transition({ opacity: 200 }),
});

style.class(cls.rowCircleFilled, {
  themes: {
    dark: { fill: "white" },
    light: { fill: colors.darkPrimary },
  },
  transition: css.transition({ opacity: 200 }),
});

const opaque: Styles = { opacity: 1 };
const transparent: Styles = { opacity: 0 };

style.class(cls.rowCircleEmpty, transparent);
style.class(cls.rowCircleFilled, transparent);
style.class(cls.rowCircleOuter, transparent);

style.parentChild(cls.rowIconEmpty, cls.rowCircleEmpty, opaque);
style.parentChild(cls.rowIconOpen, cls.rowCircleFilled, opaque);
style.parentChild(cls.rowIconClosed, cls.rowCircleFilled, opaque);
style.parentChild(cls.rowIconClosed, cls.rowCircleOuter, opaque);
