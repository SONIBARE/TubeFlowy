import { cls, style, svg, ClassName, dom, css, cssVar } from "../../browser";
import { spacings, timings } from "../../designSystem";
import * as model from "../model";
import { Styles } from "../../browser";

export default class ItemIcon {
  public svg: SVGElement;

  constructor(item: Item) {
    this.svg = this.view(item);
    this.update(item);
  }

  update = (item: Item) => {
    const isMedia = item.type !== "folder";

    if (item.title === "Music") {
      console.log("update", model.isOpen(item));
    }
    dom.assignClassMap(this.svg, {
      [cls.rowIconEmpty]: !isMedia && model.isEmptyAndNoNeedToLoad(item),
      [cls.rowIconOpen]:
        !model.isEmptyAndNoNeedToLoad(item) && model.isOpen(item),
      [cls.rowIconClosed]:
        !model.isEmptyAndNoNeedToLoad(item) && !model.isOpen(item),
      // [cls.focusCircleSvgPlaying]: player.isPlayingItem(this.item),
      [cls.rowIconClosedImage]:
        !model.isOpen(item) &&
        (item.type == "YTplaylist" || item.type == "YTchannel"),
    });
  };

  private view(item: Item) {
    const isMedia = item.type !== "folder";

    return svg.svg({
      className: cls.rowIcon,
      classMap: {
        [cls.rowIconMedia]: isMedia,
        [cls.rowIconMediaRound]: item.type == "YTchannel",
        [cls.rowIconMediaSquare]:
          item.type == "YTplaylist" || item.type == "YTvideo",
      },
      style: {
        backgroundImage: isMedia
          ? `url(${model.getImageSrc(item)})`
          : undefined,
      },
      viewBox: "0 0 100 100",
      children: [
        this.createCircleAtCenter(cls.rowCircleEmpty, 19),
        !isMedia
          ? this.createCircleAtCenter(cls.rowCircleOuter, 50)
          : undefined,
        !isMedia
          ? this.createCircleAtCenter(cls.rowCircleInner, 19)
          : undefined,
        ,
      ],
    });
  }

  createCircleAtCenter = (className: ClassName, r: number) =>
    svg.circle({ cx: 100 / 2, cy: 100 / 2, className, r });
}

const uniformShadow = (blur: number, spread: number, color: string) =>
  `0 0 ${blur}px ${spread}px ${color}`;

const insetBlack = (spread: number, alpha: number) =>
  `inset 0 0 0 ${spread}px rgba(0,0,0,${alpha.toFixed(2)})`;

style.class(cls.rowIcon, {
  marginRight: spacings.spaceBetweenCircleAndText,
  //   cursor: "pointer",
  width: spacings.outerRadius * 2,
  //   minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
  //   backgroundSize: "cover",
  //   backgroundPosition: `50% 50%`,
  color: css.useVar(cssVar.ambient),
  backgroundSize: "cover",
  backgroundPosition: `50% 50%`,
});

style.class(cls.rowCircleEmpty, {
  fill: "transparent",
  strokeWidth: 3,
  stroke: css.useVar(cssVar.accent),
  transition: css.transition({ opacity: 200 }),
});

style.class(cls.rowCircleOuter, {
  fill: css.useVar(cssVar.ambient),
  transition: css.transition({
    opacity: 200,
    fill: timings.themeSwitchDuration,
  }),
});

style.class(cls.rowCircleInner, {
  fill: css.useVar(cssVar.accent),
  transition: css.transition({
    opacity: 200,
    fill: timings.themeSwitchDuration,
  }),
});
style.class(cls.rowIconClosedImage, {
  boxShadow: uniformShadow(4, 2, "rgba(255,255,255,0.5)"),
});
style.class(cls.rowIconMediaRound, {
  borderRadius: "50%",
});

style.class(cls.rowIconMediaSquare, {
  borderRadius: 4,
});

const opaque: Styles = { opacity: 1 };
const transparent: Styles = { opacity: 0 };

style.class(cls.rowCircleEmpty, transparent);
style.class(cls.rowCircleInner, transparent);
style.class(cls.rowCircleOuter, transparent);

style.parentChild(cls.rowIconEmpty, cls.rowCircleEmpty, opaque);
style.parentChild(cls.rowIconOpen, cls.rowCircleInner, opaque);
style.parentChild(cls.rowIconClosed, cls.rowCircleInner, opaque);
style.parentChild(cls.rowIconClosed, cls.rowCircleOuter, opaque);
