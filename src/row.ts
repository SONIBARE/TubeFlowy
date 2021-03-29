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
  icons,
} from "./infra";
import { appendFocusCicrle } from "./rowIcon";
import { store } from "./state";
import { loadItemChildren } from "./api/youtube";
import * as dnd from "./dnd";

export const myRow = component((item: Item, elem: HTMLElement) => {
  let childContainer: HTMLElement | undefined;

  const appendChildren = (item: Item) => {
    // if (item.type === "YTplaylist" && store.isFolderOpenOnPage(item)) {
    //   // Mind Field : Season 1
    //   childContainer = div(
    //     { className: cls.childContainer },
    //     div(
    //       { className: cls.cardsContainer },
    //       fragment(
    //         store.getChildrenFor(item.id).map((item) =>
    //           div(
    //             { className: cls.card },
    //             img({
    //               src: store.getImageSrc(item),
    //               className: cls.cardImage,
    //             }),
    //             span({ className: cls.cardText }, item.title)
    //           )
    //         )
    //       ),
    //       div({ className: cls.cardsContainerLastItemPadding })
    //     ),
    //     div({ className: cls.cardsContainerHeightAdjuster })
    //   );
    //   elem.appendChild(childContainer);
    // } else {
    childContainer = div(
      { className: cls.childContainer },
      fragment(store.getChildrenFor(item.id).map(myRow))
    );
    elem.appendChild(childContainer);
    // }
  };

  const onAnimationFinish = (item: Item) => {
    if (!store.isFolderOpenOnPage(item) && childContainer) {
      childContainer.remove();
      childContainer = undefined;
    }
    store.redrawCanvas();
  };

  const animateChildren = (item: Item) => {
    if (childContainer && anim.revertCurrentAnimations(childContainer)) {
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

  const onChevronClick = () => {
    if (store.isNeedsToBeLoaded(item)) {
      loadItemChildren(item).then((r) => {
        store.itemLoaded(item.id, r);
        store.toggleFolderVisibility(item.id);
      });
    } else {
      store.toggleFolderVisibility(item.id);
    }
  };
  const chev = icons.chevron({
    className: cls.chevron,
    testId: "chevron-" + item.id,
    events: { click: onChevronClick },
  });

  const row = div(
    {
      className: cls.row,
      testId: "row-" + item.id,
      events: { mousemove: (e) => dnd.onItemMouseMove(item, elem, e) },
    },
    chev
  );
  const onMouseDown = (e: MouseEvent) => dnd.onItemMouseDown(item, elem, e);

  const rowText = div(
    {
      className: cls.rowText,
      contentEditable: true,
      events: {
        input: ({ currentTarget }) => {
          store.setTitle(
            item,
            (currentTarget as HTMLElement).textContent || ""
          );
        },
        keydown: (e) => {
          if (e.key === "Backspace" && e.shiftKey && e.ctrlKey) {
            store.removeItem(item);
            elem.remove();
          }
          if (e.key == "ArrowUp") {
            e.preventDefault();
            const previous = elem.previousElementSibling;
            if (previous) playCaretAtTextAtRow(previous as HTMLElement);
          }
          if (e.key == "ArrowDown") {
            e.preventDefault();
            const next = elem.nextElementSibling;
            if (next) playCaretAtTextAtRow(next as HTMLElement);
          }
          if (e.key === "Enter") {
            e.preventDefault();
            const newItem: Item = {
              id: Math.random() + "",
              type: "folder",
              title: "",
              children: [],
              isCollapsedInGallery: true,
            };
            store.insertItemAfter(newItem, item.id);
            const row = myRow(newItem);
            elem.insertAdjacentElement("afterend", row);
            playCaretAtTextAtRow(row);
          }
        },
      },
    },
    item.title
  );
  const unsub = appendFocusCicrle(item, row, onMouseDown);

  row.append(rowText);

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

const playCaretAtTextAtRow = (row: HTMLElement) => {
  const text = row.getElementsByClassName(cls.rowText)[0] as HTMLElement;
  placeCarentAtBeginingOfElement(text);
};

//utility

const placeCarentAtBeginingOfElement = (elem: HTMLElement) => {
  var range = document.createRange();
  var sel = window.getSelection();

  console.log(elem);
  range.setStart(elem, 0);
  range.collapse(true);
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
};
