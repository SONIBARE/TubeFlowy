import { header } from "./header";
import {
  cls,
  colors,
  css,
  div,
  spacings,
  canvas,
  zIndexes,
  fragment,
} from "./infra";
import { store } from "./state";

const multiplier = 5;

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

export class Minimap extends HTMLElement {
  canvas!: HTMLCanvasElement;
  track!: HTMLDivElement;
  ctx!: CanvasRenderingContext2D;

  height = 0;
  width = 0;

  trackTop = 0;
  trackHeight = 0;

  drawCanvas = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    drawChildren(
      5,
      minimapStyles.initialCircleX,
      store.getChildrenFor("HOME"),
      this.ctx
    );
  };

  private onTrackMouseDown = () => {
    document.addEventListener("mousemove", this.onMouseMove);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (e.buttons == 1) this.setTrackTop(this.trackTop + e.movementY);
    else document.removeEventListener("mousemove", this.onMouseMove);
  };

  setTrackTop = (top: number) => {
    if (top < 0) top = 0;

    const documentHeight = document.body.scrollHeight - spacings.headerHeight;
    if ((top + this.trackHeight) * multiplier > documentHeight)
      top = documentHeight / multiplier - this.trackHeight;

    console.log(
      top,
      (top + this.trackHeight) * multiplier,
      document.body.scrollHeight
    );
    this.trackTop = top;
    this.track.style.top = this.trackTop + "px";

    window.scrollTo({ top: Math.round(top * multiplier) });
  };

  updateTrackTopFromWindowScroll = () =>
    this.setTrackTop(window.scrollY / multiplier);

  updateTrackHeight = () => {
    this.trackHeight =
      (window.innerHeight - spacings.headerHeight) / multiplier;
    this.track.style.height = this.trackHeight + "px";
  };

  render() {
    this.height = window.innerHeight - spacings.headerHeight;
    this.width = 120;
    this.canvas = canvas({
      className: cls.minimapCanvas,
      width: this.width,
      height: this.height,
    });

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.drawCanvas();

    this.track = div({
      className: cls.minimapTrack,
      onMouseDown: this.onTrackMouseDown,
    });
    this.setTrackTop(0);
    this.updateTrackHeight();
    const children = fragment([this.canvas, this.track]);
    this.appendChild(children);
    this.classList.add(cls.minimap);
  }
}

customElements.define("sp-minimap", Minimap);

export const minimap = (): Minimap => {
  const minimap = document.createElement("sp-minimap") as Minimap;
  store.addEventListener("itemChanged", minimap.drawCanvas);

  //memory leaks on case of multipage
  window.addEventListener("resize", minimap.updateTrackHeight);
  window.addEventListener("scroll", minimap.updateTrackTopFromWindowScroll);

  minimap.render();
  return minimap;
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

css.class(cls.minimap, {
  position: "fixed",
  top: spacings.headerHeight,
  bottom: 0,
  right: spacings.bodyScrollWidth,
  width: 120,
  boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
  zIndex: zIndexes.minimap,
});

css.class(cls.minimapTrack, {
  position: "absolute",
  width: 120,
  // transition: "background-color 100ms",
  cursor: "pointer",
  backgroundColor: "rgba(0,0,0,0.08)",
});

css.parentHover(cls.minimap, cls.minimapTrack, {
  backgroundColor: "rgba(0,0,0,0.13)",
});

css.childHover(cls.minimap, cls.minimapTrack, {
  backgroundColor: "rgba(0,0,0,0.16)",
});

css.childActive(cls.minimap, cls.minimapTrack, {
  backgroundColor: "rgba(0,60,60,0.14)",
});

css.class(cls.minimapCanvas, {
  pointerEvents: "none",
});
