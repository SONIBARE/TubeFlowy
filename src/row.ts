import { focusItem } from "./focuser";
import {
  cls,
  css,
  fragment,
  svg,
  circle,
  div,
  anim,
  colors,
  spacings,
  component,
} from "./infra";
import { revertCurrentAnimations } from "./infra/animations";
import { chevron } from "./infra/icons";
import { store } from "./state";

const appendFocusCicrle = (
  item: Item,
  elem: HTMLElement,
  onClick: EmptyFunc
): EmptyFunc => {
  const isLightCircleTransparent = (item: Item) =>
    store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

  const lightCircle = circle({
    className: cls.lightCircle,
    cx: spacings.outerRadius,
    cy: spacings.outerRadius,
    r: spacings.outerRadius,
    fill: colors.lightPrimary,
  });

  const animateLightCircle = (item: Item) => {
    if (isLightCircleTransparent(item))
      lightCircle.classList.add(cls.transparent);
    else lightCircle.classList.remove(cls.transparent);
  };

  elem.appendChild(
    svg(
      {
        onClick,
        className: cls.focusCircleSvg,
        viewBox: `0 0 ${spacings.outerRadius * 2} ${spacings.outerRadius * 2}`,
      },
      lightCircle,
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
    )
  );

  const unsub = store.addEventListener(
    "itemChanged." + item.id,
    animateLightCircle
  );
  animateLightCircle(item);
  return unsub;
};

export const myRow = component((item: Item, elem: HTMLElement) => {
  let childContainer: HTMLElement | undefined;

  const appendChildren = (item: Item) => {
    childContainer = div(
      { className: cls.childContainer },
      fragment(store.getChildrenFor(item.id).map(myRow))
    );
    elem.appendChild(childContainer);
  };

  const onAnimationFinish = (item: Item) => {
    if (!store.isFolderOpenOnPage(item) && childContainer) {
      childContainer.remove();
      childContainer = undefined;
    }
  };

  const animateChildren = (item: Item) => {
    if (childContainer && revertCurrentAnimations(childContainer)) {
    } else if (store.isFolderOpenOnPage(item)) {
      appendChildren(item);
      if (childContainer)
        anim
          .expandHeight(childContainer)
          .addEventListener("finish", () => onAnimationFinish(item));
    } else {
      if (childContainer) {
        anim
          .collapseHeight(childContainer)
          .addEventListener("finish", () => onAnimationFinish(item));
      }
    }
  };

  const animateChevron = (item: Item) => {
    if (store.isFolderOpenOnPage(item)) chev.classList.add(cls.chevronOpen);
    else chev.classList.remove(cls.chevronOpen);
  };

  const itemEventName = "itemChanged." + item.id;

  const chev = chevron({
    className: cls.chevron,
    testId: "chevron-" + item.id,
  });
  chev.addEventListener("click", () => store.toggleFolderVisibility(item.id));

  const row = div({ className: cls.row, testId: "row-" + item.id }, chev);
  const unsub = appendFocusCicrle(item, row, () => focusItem(item));
  row.append(item.title);
  row.id = "row-" + item.id;
  elem.appendChild(row);

  store.addEventListener(itemEventName, animateChildren);
  store.addEventListener(itemEventName, animateChevron);

  if (store.isFolderOpenOnPage(item)) {
    appendChildren(item);
  }

  animateChevron(item);

  return () => {
    unsub();
    store.removeEventListener(itemEventName, animateChildren);
    store.removeEventListener(itemEventName, animateChevron);
  };
});

css.class(cls.row, {
  marginLeft: -spacings.negativeMarginForRowAtZeroLevel,
  paddingLeft:
    spacings.negativeMarginForRowAtZeroLevel + spacings.rowLeftPadding,
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontWeight: 500,
  color: colors.darkPrimary,
  transition: "opacity 400ms ease-out",
});

css.parentChild(cls.rowsHide, cls.row, {
  opacity: 0,
});

css.parentChild(cls.rowsHide, cls.childContainer, {
  borderLeft: `${spacings.borderSize}px solid transparent`,
});

css.parentChild(cls.rowsFocused, cls.row, {
  opacity: 1,
});
css.parentChild(cls.rowsFocused, cls.childContainer, {
  borderLeft: `${spacings.borderSize}px solid  ${colors.border}`,
});

css.class(cls.childContainer, {
  display: "block",
  marginLeft: spacings.spacePerLevel + spacings.rowLeftPadding,
  borderLeft: `${spacings.borderSize}px solid ${colors.border}`,
  transition: "borderLeft 400ms linear",
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
