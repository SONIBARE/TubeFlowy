import { ClassName, cls, colors, css, dom, spacings, svg } from "../../infra";
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
      stroke: colors.darkPrimary,
      fill: colors.darkPrimary,
      strokelinejoin: "round",
    });

  hide = (...elem: Element[]) =>
    elem.forEach((e) => dom.addClass(e, cls.transparent));
  show = (...elem: Element[]) =>
    elem.forEach((e) => dom.removeClass(e, cls.transparent));

  update = () => {
    const item = this.item;
    dom.assignClasses(this.svg, {
      classMap: {
        [cls.focusCircleSvgEmpty]: items.isEmptyAndNoNeedToLoad(item),
        [cls.focusCircleSvgFilledOpen]:
          !items.isEmptyAndNoNeedToLoad(item) && items.isFolderOpenOnPage(item),
        [cls.focusCircleSvgFilledClosed]:
          !items.isEmptyAndNoNeedToLoad(item) &&
          !items.isFolderOpenOnPage(item),
        [cls.focusCircleSvgPlaying]: player.isPlayingItem(this.item),
      },
    });
  };

  create() {
    const item = this.item;
    return svg.svg(
      {
        className: cls.focusCircleSvg,
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
          // mousedown: onMouseDown,
        },
        viewBox: "0 0 100 100",
      },
      this.createCircleAtCenter({
        className: cls.rowCircleOuter,
        r: 50,
        fill: colors.lightPrimary,
      }),
      this.createCircleAtCenter({
        className: cls.rowCircleFilled,
        r: 19,
        fill: colors.darkPrimary,
      }),
      this.createCircleAtCenter({
        className: cls.rowCircleEmpty,
        r: 19,
        strokeWidth: 2,
        stroke: colors.darkPrimary,
        fill: "none",
      }),
      this.polygon("40,32 69,50 40,68", 10, cls.rowCirclePlay),
      this.polygon("30,30 45,30 45,70 30,70", 2, cls.rowCirclePause),
      this.polygon("70,70 55,70 55,30 70,30", 2, cls.rowCirclePause)
    );
  }

  render = () => this.svg;
}

css.class(cls.focusCircleSvg, {
  marginRight: spacings.spaceBetweenCircleAndText,
  cursor: "pointer",
  width: spacings.outerRadius * 2,
  minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
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

css.parentChild(cls.focusCircleSvgEmpty, cls.rowCircleEmpty, {
  opacity: 1,
});
css.parentChild(cls.focusCircleSvgFilledOpen, cls.rowCircleFilled, {
  opacity: 1,
});
css.parentChild(cls.focusCircleSvgFilledClosed, cls.rowCircleFilled, {
  opacity: 1,
});
css.parentChild(cls.focusCircleSvgFilledClosed, cls.rowCircleOuter, {
  opacity: 1,
});

css.parentHover(cls.treeRow, cls.rowCirclePlay, {
  opacity: 1,
});
css.parentHover(cls.treeRow, cls.rowCircleFilled, {
  opacity: 0,
});
css.selector(`.${cls.treeRow}.${cls.rowSelected} .${cls.rowCirclePlay}`, {
  opacity: 1,
});
css.selector(`.${cls.treeRow}.${cls.rowSelected} .${cls.rowCircleFilled}`, {
  opacity: 0,
});

css.parentParentChild(cls.treeRow, cls.focusCircleSvgEmpty, cls.rowCirclePlay, {
  opacity: 0,
});

css.parentParentChild(
  cls.treeRow,
  cls.focusCircleSvgPlaying,
  cls.rowCirclePlay,
  {
    opacity: 0,
  }
);

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCircleFilled, {
  opacity: 0,
});

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCirclePause, {
  opacity: 1,
});
