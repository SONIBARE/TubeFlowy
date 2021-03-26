import {
  cls,
  colors,
  css,
  div,
  spacings,
  canvas,
  zIndexes,
  fragment,
  ids,
} from "./infra";
import { store } from "./state";

const multiplier = 8;

const minimapStyles = {
  fontSize: spacings.pageFontSize / multiplier,
  initialCircleY:
    (spacings.pageMarginTop +
      51 + //51 is taken from header font size of 23pt multiplied by line height
      spacings.outerRadius +
      spacings.rowVecticalPadding +
      1) /
    multiplier,
  distanceBetweenCircles: 40 / multiplier, //hardcoded for now, need to account for line height and text wrap
  distancePerLevel:
    (spacings.spacePerLevel + spacings.outerRadius) / multiplier,
  spaceBetweenCircleCenterAndText:
    (spacings.outerRadius + spacings.spaceBetweenCircleAndText) / multiplier,
  smallR: spacings.innerRadius / multiplier,
  bigR: spacings.outerRadius / multiplier,
};

export class Minimap extends HTMLElement {
  scrollContainer!: HTMLElement;
  canvas!: HTMLCanvasElement;
  track!: HTMLDivElement;
  ctx!: CanvasRenderingContext2D;

  height = 0;
  width = 0;

  trackTop = 0;
  trackTopPercent = 0;
  trackHeight = 0;

  drawCanvas = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.height = this.scrollContainer.scrollHeight / multiplier;
    this.canvas.setAttribute("height", this.height + "");
    drawTitle(
      22 / multiplier,
      minimapStyles.initialCircleY - minimapStyles.bigR - 2,
      store.items[store.itemIdFocused],
      this.ctx
    );
    drawChildren(
      5,
      minimapStyles.initialCircleY,
      store.getFocusChildren(),
      this.ctx
    );
  };

  onWindowResize = () => {
    this.updateTrackHeight();
  };

  private onTrackMouseDown = () => {
    document.addEventListener("mousemove", this.onMouseMove);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (e.buttons == 1) {
      this.setTrackTop(this.trackTop + e.movementY);
    } else document.removeEventListener("mousemove", this.onMouseMove);
  };

  //TODO: test the shit out of this code
  setTrackTop = (top: number) => {
    if (top < 0) top = 0;

    const documentHeight = this.scrollContainer.scrollHeight;

    const max = this.getMaxTrackPosition();
    const percent = top / max;
    if (percent >= 1) top = max;

    this.trackTop = top;
    this.track.style.top = top + "px";

    const target = percent * (documentHeight - this.trackHeight * multiplier);

    this.scrollContainerTo(target);

    //COPY-PASTA
    const canvasHeight = this.scrollContainer.scrollHeight / multiplier;
    const clientHeight = this.clientHeight;
    if (canvasHeight > clientHeight) {
      this.canvas.style.top = -percent * (canvasHeight - clientHeight) + "px";
    }
  };

  getMaxTrackPosition = () => {
    const canvasHeight = this.scrollContainer.scrollHeight / multiplier;
    const minimapHeight = this.clientHeight;
    if (canvasHeight > minimapHeight) return minimapHeight - this.trackHeight;
    else return canvasHeight - this.trackHeight;
  };

  onContainerScroll = () => {
    const max = this.getMaxTrackPosition();
    const percent =
      this.scrollContainer.scrollTop /
      (this.scrollContainer.scrollHeight - this.clientHeight);

    this.trackTop = percent * max;
    this.track.style.top = percent * max + "px";

    //COPY-PASTA
    const canvasHeight = this.scrollContainer.scrollHeight / multiplier;
    const clientHeight = this.clientHeight;
    if (canvasHeight > clientHeight) {
      this.canvas.style.top = -percent * (canvasHeight - clientHeight) + "px";
    }
  };

  updateTrackHeight = () => {
    this.trackHeight =
      (window.innerHeight -
        spacings.headerHeight -
        spacings.playerFooterHeight) /
      multiplier;
    this.track.style.height = this.trackHeight + "px";
  };

  private scrollContainerTo = (top: number) => {
    //ok, this is kind of dumm, but I want to update scroll position without triggering scroll events on the container
    //I'm listening only to user scroll events (mouse wheel, page down, arrow up type of events)
    this.scrollContainer.removeEventListener("scroll", this.onContainerScroll);
    this.scrollContainer.scrollTo({ top });

    requestAnimationFrame(() => {
      this.scrollContainer.addEventListener("scroll", this.onContainerScroll);
    });
  };

  render() {
    this.height = this.scrollContainer.scrollHeight / multiplier;
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
      events: {
        mousedown: this.onTrackMouseDown,
      },
    });

    const children = fragment([this.canvas, this.track]);
    this.appendChild(children);
    this.classList.add(cls.minimap);
  }

  connectedCallback() {
    this.scrollContainer.addEventListener("scroll", this.onContainerScroll);

    requestAnimationFrame(() => {
      this.updateTrackHeight();
      this.setTrackTop(0);
    });
  }
}

customElements.define("sp-minimap", Minimap);

export const minimap = (scrollContainer: HTMLElement): Minimap => {
  const minimap = document.createElement("sp-minimap") as Minimap;
  minimap.id = ids.minimap;
  minimap.scrollContainer = scrollContainer;
  store.addEventListener("redrawMinimap", minimap.drawCanvas);

  //memory leaks on case of multipage
  window.addEventListener("resize", minimap.onWindowResize);

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

const drawTitle = (
  x: number,
  y: number,
  item: Item,
  ctx: CanvasRenderingContext2D
) => {
  ctx.font = `${spacings.pageTitleFontSize / multiplier}px "Segoe UI Semibold"`;
  ctx.fillStyle = colors.darkPrimary;
  ctx.fillText(item.title, x, y);
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
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  // gridArea: "rightSidebar",
  // top: spacings.headerHeight,
  // bottom: 0,
  // right: spacings.bodyScrollWidth,
  backgroundColor: "white",
  width: 120,
  boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
  zIndex: zIndexes.minimap,
  userSelect: "none",
  overflow: "hidden",
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
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  pointerEvents: "none",
});
