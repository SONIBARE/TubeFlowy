import {
  ClassName,
  cls,
  colors,
  css,
  dom,
  spacings,
  Styles,
  svg,
} from "../infra";
import { onItemMouseDown } from "./dnd";
import { items, player } from "../domain";

export default class FoderIcon {
  svg: SVGElement;
  cleanup: EmptyFunc;

  constructor(public item: Item) {
    this.cleanup = player.onItemPlay(item.id, this.update);
    this.svg = this.create();
  }

  createCircleAtCenter = (props: Omit<svg.CircleProps, "cx" | "cy">) =>
    svg.circle({
      cx: 100 / 2,
      cy: 100 / 2,
      ...props,
    });

  polygon = (points: string, strokeWidth: number, cn: ClassName) =>
    svg.polygon({
      className: cn,
      points,
      strokeWidth,
      stroke: "currentColor",
      fill: "currentColor",
      strokelinejoin: "round",
    });

  hide = (...elem: Element[]) =>
    elem.forEach((e) => dom.addClass(e, cls.transparent));
  show = (...elem: Element[]) =>
    elem.forEach((e) => dom.removeClass(e, cls.transparent));

  update = () => {
    const item = this.item;
    const isMedia = item.type !== "folder";

    dom.assignClasses(this.svg, {
      classMap: {
        [cls.focusCircleSvgEmpty]:
          !isMedia && items.isEmptyAndNoNeedToLoad(item),
        [cls.focusCircleSvgFilledOpen]:
          !items.isEmptyAndNoNeedToLoad(item) && items.isFolderOpenOnPage(item),
        [cls.focusCircleSvgFilledClosed]:
          !items.isEmptyAndNoNeedToLoad(item) &&
          !items.isFolderOpenOnPage(item),
        [cls.focusCircleSvgPlaying]: player.isPlayingItem(this.item),
        [cls.closedContainerImage]:
          !items.isFolderOpenOnPage(item) &&
          (item.type == "YTplaylist" || item.type == "YTchannel"),
      },
    });
  };

  create() {
    const item = this.item;
    const isMedia = item.type !== "folder";

    const res = svg.svg(
      {
        className: cls.focusCircleSvg,
        classMap: {
          [cls.mediaSvg]: isMedia,
          [cls.roundImage]: item.type == "YTchannel",
          [cls.squareImage]:
            item.type == "YTplaylist" || item.type == "YTvideo",
        },
        testId: "itemIcon-" + item.id,
        events: {
          click: (e) => {
            e.stopPropagation();
            if (e.ctrlKey) items.focusItem(item.id);
            else if (player.isPlayingItem(item)) {
              player.pause();
            } else {
              player.play(item.id);
            }
          },
          mousedown: (e) => onItemMouseDown(item, e),
        },
        viewBox: "0 0 100 100",
      },
      !isMedia &&
        this.createCircleAtCenter({
          className: cls.rowCircleOuter,
          r: 50,
          fill: colors.lightPrimary,
        }),
      !isMedia &&
        this.createCircleAtCenter({
          className: cls.rowCircleFilled,
          r: 19,
          fill: colors.darkPrimary,
        }),
      !isMedia &&
        this.createCircleAtCenter({
          className: cls.rowCircleEmpty,
          r: 19,
          strokeWidth: 2,
          stroke: colors.darkPrimary,
          fill: "white",
        }),
      this.polygon("40,32 69,50 40,68", 10, cls.rowCirclePlay),
      this.polygon("30,30 45,30 45,70 30,70", 2, cls.rowCirclePause),
      this.polygon("70,70 55,70 55,30 70,30", 2, cls.rowCirclePause)
    );
    res.style.setProperty(
      "background-image",
      `url(${items.getImageSrc(item)})`
    );
    return res;
  }

  render = () => this.svg;
}

css.class(cls.focusCircleSvg, {
  marginRight: spacings.spaceBetweenCircleAndText,
  cursor: "pointer",
  width: spacings.outerRadius * 2,
  minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
  backgroundSize: "cover",
  backgroundPosition: `50% 50%`,
  color: colors.darkPrimary,
});

const insetBlack = (spread: number, alpha: number) =>
  `inset 0 0 0 ${spread}px rgba(0,0,0,${alpha.toFixed(2)})`;

const shadow = (blur: number, spread: number, color: string) =>
  `0 0 ${blur}px ${spread}px ${color}`;
css.class(cls.mediaSvg, {
  color: "white",
  boxShadow: insetBlack(2, 0.1),
  ...css.transition({ boxShadow: 200 }),
});

css.parentHover(cls.treeRow, cls.mediaSvg, {
  boxShadow: insetBlack(16, 0.2),
});

css.class(cls.closedContainerImage, {
  boxShadow: shadow(2, 3, colors.mediumPrimary),
});

css.parentHover(cls.treeRow, cls.closedContainerImage, {
  boxShadow: [insetBlack(16, 0.2), shadow(2, 3, colors.mediumPrimary)].join(
    ","
  ),
});

css.class(cls.squareImage, {
  borderRadius: 4,
});

css.class(cls.roundImage, {
  borderRadius: "50%",
});

css.classes(
  [
    cls.rowCircleEmpty,
    cls.rowCircleFilled,
    cls.rowCircleOuter,
    cls.rowCirclePlay,
    cls.rowCirclePause,
  ],
  {
    opacity: 0,
    ...css.transition({ opacity: 200 }),
  }
);

const opaque: Styles = { opacity: 1 };
const transparent: Styles = { opacity: 0 };

css.parentChild(cls.focusCircleSvgEmpty, cls.rowCircleEmpty, opaque);
css.parentChild(cls.focusCircleSvgFilledOpen, cls.rowCircleFilled, opaque);
css.parentChild(cls.focusCircleSvgFilledClosed, cls.rowCircleFilled, opaque);
css.parentChild(cls.focusCircleSvgFilledClosed, cls.rowCircleOuter, opaque);

css.parentHover(cls.treeRow, cls.rowCirclePlay, opaque);
css.parentHover(cls.treeRow, cls.rowCircleFilled, transparent);

css.selector(
  `.${cls.treeRow}.${cls.rowSelected} .${cls.rowCirclePlay}`,
  opaque
);
css.selector(
  `.${cls.treeRow}.${cls.rowSelected} .${cls.rowCircleFilled}`,
  transparent
);
css.selector(`.${cls.treeRow}.${cls.rowSelected} .${cls.mediaSvg}`, {
  boxShadow: insetBlack(16, 0.2),
});
css.selector(
  `.${cls.treeRow}.${cls.rowSelected} .${cls.closedContainerImage}`,
  {
    boxShadow: [insetBlack(16, 0.2), shadow(2, 3, colors.mediumPrimary)].join(
      ","
    ),
  }
);
css.selector(`.${cls.treeRow}.${cls.rowSelected} .${cls.chevron}`, opaque);
css.parentParentChild(
  cls.treeRow,
  cls.focusCircleSvgEmpty,
  cls.rowCirclePlay,
  transparent
);

css.parentParentChild(
  cls.treeRow,
  cls.focusCircleSvgPlaying,
  cls.rowCirclePlay,
  {
    opacity: 0,
  }
);

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCircleFilled, transparent);

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCirclePause, opaque);
