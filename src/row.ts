import {
  cls,
  css,
  fragment,
  svg,
  circle,
  div,
  animate,
  colors,
  spacings,
} from "./infra";
import { assignClasses } from "./infra/dom";
import { chevron } from "./infra/icons";
import { ClassMap } from "./infra/keys";
import { store } from "./state";

class MyRow extends HTMLElement {
  chevron!: SVGElement;
  lightCircle!: SVGElement;
  childContainer: HTMLElement | undefined;
  itemId = "";

  isLightCircleTransparent = (item: Item) =>
    store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

  focusCircle = (item: Item) => {
    this.lightCircle = circle({
      className: cls.lightCircle,
      classMap: {
        [cls.transparent]: this.isLightCircleTransparent(item),
      },
      cx: spacings.outerRadius,
      cy: spacings.outerRadius,
      r: spacings.outerRadius,
      fill: colors.lightPrimary,
    });
    return svg(
      {
        className: cls.focusCircleSvg,
        viewBox: `0 0 ${spacings.outerRadius * 2} ${spacings.outerRadius * 2}`,
      },
      this.lightCircle,
      circle({
        className: cls.outerCircle,
        cx: spacings.outerRadius,
        cy: spacings.outerRadius,
        r: spacings.outerRadius,
        fill: colors.mediumPrimary,
      }),
      circle({
        cx: spacings.outerRadius,
        cy: spacings.outerRadius,
        r: spacings.innerRadius,
        fill: colors.darkPrimary,
      })
    );
  };

  appendChildren = (item: Item) => {
    this.childContainer = div(
      { className: cls.childContainer },
      fragment(store.getChildrenFor(item.id).map(renderRow))
    );
    this.appendChild(this.childContainer);
  };

  onAnimationFinish = (item: Item) => {
    if (!store.isFolderOpenOnPage(item) && this.childContainer) {
      this.childContainer.remove();
      this.childContainer = undefined;
    }
  };

  expandHeight = (elem: HTMLElement) =>
    animate(
      elem,
      [
        { height: 0, opacity: 0 },
        { height: elem.clientHeight, opacity: 1 },
      ],
      { duration: 200 }
    );

  collapseHeight = (elem: HTMLElement) =>
    animate(
      elem,
      [
        { height: elem.clientHeight, opacity: 1 },
        { height: 0, opacity: 0 },
      ],
      { duration: 200 }
    );

  animateChildren = (item: Item) => {
    if (this.childContainer && this.childContainer.getAnimations()[0]) {
      this.childContainer.getAnimations()[0].reverse();
    } else if (store.isFolderOpenOnPage(item)) {
      this.appendChildren(item);
      if (this.childContainer)
        this.expandHeight(this.childContainer).addEventListener("finish", () =>
          this.onAnimationFinish(item)
        );
    } else {
      if (this.childContainer) {
        this.collapseHeight(this.childContainer).addEventListener(
          "finish",
          () => this.onAnimationFinish(item)
        );
      }
    }
  };

  animateChevron = (item: Item) => {
    if (store.isFolderOpenOnPage(item))
      this.chevron.classList.add(cls.chevronOpen);
    else this.chevron.classList.remove(cls.chevronOpen);
  };

  animateLightCircle = (item: Item) => {
    if (this.isLightCircleTransparent(item))
      this.lightCircle.classList.add(cls.transparent);
    else this.lightCircle.classList.remove(cls.transparent);
  };

  get itemEventName() {
    return "itemChanged." + this.itemId;
  }

  render(item: Item) {
    this.itemId = item.id;
    this.chevron = chevron(cls.chevron);
    this.chevron.addEventListener("click", () =>
      store.toggleFolderVisibility(item.id)
    );

    this.appendChild(
      div(
        { className: cls.row },
        this.chevron,
        this.focusCircle(item),
        item.title
      )
    );

    store.addEventListener(this.itemEventName, this.animateChildren);
    store.addEventListener(this.itemEventName, this.animateChevron);
    store.addEventListener(this.itemEventName, this.animateLightCircle);

    if (store.isFolderOpenOnPage(item)) this.appendChildren(item);
    this.animateChevron(item);
  }

  disconnectedCallback() {
    store.removeEventListener(this.itemEventName, this.animateChildren);
    store.removeEventListener(this.itemEventName, this.animateChevron);
    store.removeEventListener(this.itemEventName, this.animateLightCircle);
  }

  static create(item: Item) {
    const row1 = document.createElement("tubeflowy-row") as MyRow;
    row1.render(item);
    return row1;
  }
}
export const renderRow = MyRow.create;

customElements.define("tubeflowy-row", MyRow);

css.class(cls.row, {
  marginLeft: -1000,
  paddingLeft: 1000 + spacings.rowLeftPadding,
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontWeight: 500,
  color: colors.darkPrimary,
});

css.class(cls.childContainer, {
  marginLeft: spacings.spacePerLevel + spacings.rowLeftPadding,
  borderLeft: `${spacings.borderSize}px solid ${colors.border}`,
  overflow: "hidden",
});

css.parentHover(cls.row, cls.chevron, {
  opacity: 1,
});

css.class(cls.chevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  minWidth: spacings.chevronSize,
  opacity: 0,
  transition: "transform 200ms, opacity 100ms",
  cursor: "pointer",
  color: colors.mediumPrimary,
  userSelect: "none",
});

css.hover(cls.chevron, {
  color: colors.darkPrimary,
});

css.class(cls.chevronOpen, {
  transform: "rotateZ(90deg)",
});

//FOCUS CIRCLES

css.class(cls.focusCircleSvg, {
  marginRight: spacings.spaceBetweenCircleAndText,
  cursor: "pointer",
  width: spacings.outerRadius * 2,
  minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
});

css.class(cls.outerCircle, {
  opacity: 0,
  transition: "transform 100ms",
  transform: "scale(0.5)",
  transformOrigin: "50%",
});

css.parentHover(cls.focusCircleSvg, cls.outerCircle, {
  transform: "scale(1)",
  opacity: 1,
});

css.class(cls.lightCircle, {
  opacity: 1,
  transition: "opacity 100ms",
});

css.class(cls.transparent, {
  opacity: 0,
});
