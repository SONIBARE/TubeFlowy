import { cls, colors, css, div, spacings, canvas } from "./infra";
import { store } from "./state";

const multiplier = 9;

const minimapStyles = {
  fontSize: spacings.pageFontSize / multiplier,
  initialCircleX:
    (spacings.pageMarginTop +
      spacings.outerRadius +
      spacings.rowVecticalPadding +
      1) /
    multiplier,
  distanceBetweenCircles: 29 / multiplier, //hardcoded for now, need to account for line height and text wrap
  distancePerLevel:
    (spacings.spacePerLevel + spacings.outerRadius) / multiplier,
  spaceBetweenCircleCenterAndText:
    (spacings.outerRadius + spacings.spaceBetweenCircleAndText) / multiplier,
  smallR: spacings.innerRadius / multiplier,
  bigR: spacings.outerRadius / multiplier,
};

export const appendSideScroll = (container: HTMLElement) =>
  container.appendChild(sideScroll());

const sideScroll = () => {
  const myCanvas = canvas({
    className: cls.minimapCanvas,
    width: 120,
    height: window.innerHeight - spacings.headerHeight,
  });

  const ctx = myCanvas.getContext("2d") as CanvasRenderingContext2D;

  drawChildren(
    5,
    minimapStyles.initialCircleX,
    store.getChildrenFor("HOME"),
    ctx
  );

  return div(
    { className: cls.sideScroll },
    myCanvas,
    div({ className: cls.sideScrollTrack })
  );
};

const drawChildren = (
  x: number,
  y: number,
  items: Item[],
  ctx: CanvasRenderingContext2D
): number => {
  let counter = 0;
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    drawItem(x, y + counter * minimapStyles.distanceBetweenCircles, item, ctx);
    counter += 1;
    if (store.isFolderOpenOnPage(item)) {
      counter += drawChildren(
        x + minimapStyles.distancePerLevel,
        y + counter * minimapStyles.distanceBetweenCircles,
        store.getChildrenFor(item.id),
        ctx
      );
    }
  }
  return counter;
};
//TODO: consider where to place this method (common with sideScroll.ts)
const isLightCircleTransparent = (item: Item) =>
  store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

const drawItem = (
  x: number,
  y: number,
  item: Item,
  ctx: CanvasRenderingContext2D
) => {
  if (!isLightCircleTransparent(item))
    drawCircle(
      { cx: x, cy: y, fill: colors.lightPrimary, r: minimapStyles.bigR },
      ctx
    );
  drawCircle(
    { cx: x, cy: y, fill: colors.darkPrimary, r: minimapStyles.smallR },
    ctx
  );

  ctx.font = `${minimapStyles.fontSize}px "Segoe UI Semibold"`;
  ctx.fillStyle = colors.darkPrimary;
  ctx.fillText(
    item.title,
    x + minimapStyles.spaceBetweenCircleCenterAndText,
    y + 1 // plus 1 is a eye picked shift to account for line height (picked for multiplier 7)
  );
};

interface Circle {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

const drawCircle = (circle: Circle, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillStyle = circle.fill;
  ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2, true);
  ctx.fill();
};

css.class(cls.sideScroll, {
  position: "fixed",
  top: spacings.headerHeight,
  bottom: 0,
  right: spacings.bodyScrollWidth,
  width: 120,
});

css.class(cls.sideScrollTrack, {
  position: "absolute",
  top: 0,
  width: 120,
  height: (window.innerHeight - spacings.headerHeight) / multiplier,
  // transition: "background-color 100ms",
  cursor: "pointer",
  backgroundColor: "rgba(0,0,0,0.08)",
});

css.parentHover(cls.sideScroll, cls.sideScrollTrack, {
  backgroundColor: "rgba(0,0,0,0.13)",
});

css.childHover(cls.sideScroll, cls.sideScrollTrack, {
  backgroundColor: "rgba(0,0,0,0.2)",
});

css.class(cls.minimapCanvas, {
  pointerEvents: "none",
});
