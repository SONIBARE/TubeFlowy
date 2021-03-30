import {
  cls,
  css,
  fragment,
  div,
  anim,
  colors,
  spacings,
  component,
  timings,
} from "../infra";
import { events, items } from "../domain";
import { playCaretAtTextAtRow, renderRow } from "./row";

export const rowWithChildren = component((item: Item, elem: HTMLElement) => {
  let childContainer: HTMLElement | undefined;

  const appendChildren = (item: Item) => {
    childContainer = div(
      { className: cls.childContainer },
      fragment(items.getChildrenFor(item.id).map(rowWithChildren))
    );
    elem.appendChild(childContainer);
  };

  const onAnimationFinish = (item: Item) => {
    if (!items.isFolderOpenOnPage(item) && childContainer) {
      childContainer.remove();
      childContainer = undefined;
    }
    items.redrawCanvas();
  };

  const animateChildren = (item: Item) => {
    if (childContainer && anim.revertCurrentAnimations(childContainer)) {
    } else if (items.isFolderOpenOnPage(item)) {
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
  const row = renderRow(item, elem);

  row.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newItem: Item = items.createNewItemAfter(item.id);
      const row = rowWithChildren(newItem);
      elem.insertAdjacentElement("afterend", row);
      playCaretAtTextAtRow(row);
    }
  });
  elem.appendChild(row);

  if (items.isFolderOpenOnPage(item)) {
    appendChildren(item);
  }

  return events.addCompoundEventListener(
    "item-collapse",
    item.id,
    animateChildren
  );
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
  whiteSpace: "nowrap",
  color: colors.darkPrimary,
  // lineHeight: 1,
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
  //this break cardsContainer, need to think on how to handle this
  //also if enabled break collapse\expand animation
  // overflow: "hidden",

  marginTop: -spacings.rowVecticalPadding,
  paddingTop: spacings.rowVecticalPadding,

  marginBottom: -spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,

  position: "relative",
});

css.class(cls.cardsContainer, {
  height: (spacings.cardHeight + spacings.cardPadding) * 3 + 15,
  overflowX: "overlay" as any,
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignContent: "flex-start",
});

css.selector(`.${cls.cardsContainer}::-webkit-scrollbar`, {
  height: 8,
});

css.selector(`.${cls.cardsContainer}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});

css.class(cls.cardsContainerHeightAdjuster, {
  width: 40,
  height: 2,
  backgroundColor: colors.lightPrimary,
  cursor: "n-resize",
  position: "absolute",
  bottom: 2,
  left: "calc(50% - 20px)",
});

css.hover(cls.cardsContainerHeightAdjuster, {
  backgroundColor: colors.darkPrimary,
});

css.class(cls.cardsContainerLastItemPadding, {
  height: "100%",
  width: spacings.cardPadding,
});

css.class(cls.card, {
  marginLeft: spacings.cardPadding,
  marginTop: spacings.cardPadding,
  borderRadius: 4,
  width: spacings.cardWidth,
  height: spacings.cardHeight,
  // backgroundColor: colors.border,
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  overflow: "hidden",
  boxShadow: "1px 1px 4px rgb(0, 0, 0, 0.3)",
  transition: "all 200ms",
  cursor: "pointer",
});

css.hover(cls.card, {
  boxShadow: "1px 2px 5px 0 rgb(0, 0, 0, 0.53)",
  backgroundColor: colors.border,
});

css.class(cls.cardImage, {
  height: spacings.cardHeight,
  // width: 40 * 1.5,
  objectFit: "cover",
});

css.class(cls.cardText, {
  flex: 1,
  fontSize: 14,
  lineHeight: "1.2",
  padding: `0 ${spacings.cardTextPadding}px`,
  paddingBottom: spacings.cardTextBottomPadding,
});

css.parentHover(cls.row, cls.chevron, {
  opacity: 1,
});

css.class(cls.chevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  minWidth: spacings.chevronSize,
  opacity: 0,
  transition: `transform ${timings.cardExpandCollapseDuration}ms, opacity 100ms`,
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

css.class(cls.rowText, {
  outline: "none",
  lineHeight: 41 - 8,
  flex: 1,
});

css.selection(cls.rowText, {
  background: colors.lightPrimary,
});
