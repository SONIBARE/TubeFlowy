import { cls, colors, spacings, css, dom, svg, compose } from "../infra";
import { events, items } from "../domain";
import * as player from "../player/playerFooter";

export const folderIcon = (
  item: Item,
  parent: HTMLElement,
  onMouseDown: (e: MouseEvent) => void
) => {
  const rowIcon = svg.svg(
    {
      className: cls.focusCircleSvg,
      events: {
        click: () => player.playItem(item),
        mousedown: onMouseDown,
      },
      viewBox: "0 0 100 100",
    },
    svg.circle({
      className: cls.rowCircleOuter,
      cx: 100 / 2,
      cy: 100 / 2,
      r: 50,
      fill: colors.lightPrimary,
    }),
    svg.circle({
      className: cls.rowCircleFilled,
      cx: 100 / 2,
      cy: 100 / 2,
      r: 19,
      fill: colors.darkPrimary,
    }),
    svg.circle({
      className: cls.rowCircleEmpty,
      cx: 100 / 2,
      cy: 100 / 2,
      r: 19,
      strokeWidth: 2,
      stroke: colors.darkPrimary,
      fill: "none",
    }),
    svg.polygon({
      className: cls.rowCirclePlay,
      points: "40,32 69,50 40,68",
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: 10,
      strokelinejoin: "round",
    }),
    svg.polygon({
      className: cls.rowCirclePause,
      points: "30,30 45,30 45,70 30,70",
      strokelinejoin: "round",
      strokeWidth: 2,
      stroke: "currentColor",
      fill: "currentColor",
    }),
    svg.polygon({
      className: cls.rowCirclePause,
      points: "70,70 55,70 55,30 70,30",
      fill: "currentColor",
      strokelinejoin: "round",
      strokeWidth: 2,
      stroke: "currentColor",
    })
  );

  parent.appendChild(rowIcon);

  const updateRowIcon = () => {
    dom.assignClasses(rowIcon, {
      classMap: {
        [cls.focusCircleSvgEmpty]: items.isEmptyAndNoNeedToLoad(item),
        [cls.focusCircleSvgFilledOpen]:
          !items.isEmptyAndNoNeedToLoad(item) && items.isFolderOpenOnPage(item),
        [cls.focusCircleSvgFilledClosed]:
          !items.isEmptyAndNoNeedToLoad(item) &&
          !items.isFolderOpenOnPage(item),
      },
    });
  };
  const updatePlayState = (isPlaying: boolean) => {
    dom.assignClasses(rowIcon, {
      classMap: { [cls.focusCircleSvgPlaying]: isPlaying },
    });
  };
  updateRowIcon();

  const unsub = events.addCompoundEventListener(
    "item-collapse",
    item.id,
    updateRowIcon
  );

  updatePlayState(false);
  const unsub2 = events.addCompoundEventListener(
    "item-play",
    item.id,
    updatePlayState
  );
  const unsub3 = events.addCompoundEventListener(
    "item-children-length-changed",
    item.id,
    updateRowIcon
  );

  return compose(unsub, unsub2, unsub3);
};

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
css.parentHover(cls.row, cls.rowCirclePlay, {
  opacity: 1,
});
css.parentHover(cls.row, cls.rowCircleFilled, {
  opacity: 0,
});
css.parentParentChild(cls.row, cls.focusCircleSvgEmpty, cls.rowCirclePlay, {
  opacity: 0,
});

css.parentParentChild(cls.row, cls.focusCircleSvgPlaying, cls.rowCirclePlay, {
  opacity: 0,
});

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCircleFilled, {
  opacity: 0,
});

css.parentChild(cls.focusCircleSvgPlaying, cls.rowCirclePause, {
  opacity: 1,
});
