import { cls, div, dom, icons, css, spacings, colors, timings } from "../infra";
import { events, items, TubeflowyEvents } from "../domain";
import { loadItemChildren } from "../api/youtube";
import * as dnd from "../dnd";
import { RowWithChildren } from "./rowWithChildren";
import { itemImage } from "./itemImage";
import { folderIcon } from "./folderIcon";
import { selectItem } from "./rowhighlight";
import * as player from "../player/playerFooter";

export class Row extends HTMLElement {
  item!: Item;
  unsubs = [] as EmptyFunc[];

  on(eventName: keyof TubeflowyEvents, cb: EmptyFunc) {
    this.unsubs.push(
      events.addCompoundEventListener(eventName, this.item.id, cb)
    );
  }

  disconnectedCallback() {
    this.unsubs.forEach((unsub) => unsub());
  }

  toggleItemVisibility = () => {
    const item = this.item;
    if (items.isNeedsToBeLoaded(item)) {
      loadItemChildren(item).then((r) => {
        items.itemLoaded(item.id, r);
        items.toggleFolderVisibility(item.id);
      });
    } else {
      items.toggleFolderVisibility(item.id);
    }
  };

  viewChevron() {
    const item = this.item;

    const chev = icons.chevron({
      className: cls.chevron,
      testId: "chevron-" + item.id,
      events: {
        click: (e) => {
          e.stopPropagation();
          this.toggleItemVisibility();
        },
      },
    });
    this.appendChild(chev);

    const animateChevron = () => {
      dom.assignClasses(chev, {
        classMap: { [cls.chevronOpen]: items.isFolderOpenOnPage(item) },
      });
    };
    this.on("item-collapse", animateChevron);
    animateChevron();

    const updateChevronIsActive = () => {
      dom.assignClasses(chev, {
        classMap: { [cls.chevronInactive]: items.isEmptyAndNoNeedToLoad(item) },
      });
    };
    this.on("item-children-length-changed", updateChevronIsActive);
    updateChevronIsActive();
  }

  render(item: Item, rowWithChildren: RowWithChildren) {
    this.id = "row-" + item.id;

    this.viewChevron();

    this.addEventListener("click", (e) => {
      const currentlyFocused = document.getElementsByClassName(cls.rowSelected);

      for (const el of currentlyFocused) el.classList.remove(cls.rowSelected);

      selectItem(item);
    });

    const rowText = div(
      {
        className: [
          cls.rowText,
          items.isVideo(item) ? cls.rowTextVideo : cls.none,
        ],
        events: {
          input: ({ currentTarget }) => {
            items.setTitle(item, currentTarget.textContent || "");
          },
          keydown: (e) => {
            if (e.key === "Backspace" && e.shiftKey && e.ctrlKey) {
              items.removeItem(item);
              rowWithChildren.remove();
            }
            if (e.code === "Space" && e.ctrlKey) {
              this.toggleItemVisibility();
            }
            if (e.key === "x" && e.altKey) {
              player.playItem(item);
            }
          },
        },
      },
      item.title
    );

    this.classList.add(cls.row);

    this.addEventListener("mousemove", (e) =>
      dnd.onItemMouseMove(item, rowWithChildren, e)
    );

    const onMouseDown = (e: MouseEvent) =>
      dnd.onItemMouseDown(item, rowWithChildren, e);

    const unsub = items.hasImagePreview(item)
      ? itemImage(item, this, onMouseDown)
      : folderIcon(item, this, onMouseDown);

    this.append(rowText);

    this.unsubs.push(unsub);
  }
}

customElements.define("slp-row", Row);

export const renderRow = (item: Item, rowWithChildren: RowWithChildren) => {
  const elem = document.createElement("slp-row") as Row;
  elem.item = item;
  elem.render(item, rowWithChildren);
  return elem;
};

css.class(cls.row, {
  marginLeft: -spacings.negativeMarginForRowAtZeroLevel,
  paddingLeft:
    spacings.negativeMarginForRowAtZeroLevel + spacings.rowLeftPadding,
  paddingTop: spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
  display: "flex",
  color: colors.darkPrimary,
  transition: "opacity 400ms ease-out",
  cursor: "pointer",
});

css.hover(cls.row, {
  backgroundColor: colors.superLight,
});

css.parentChild(cls.rowsHide, cls.row, {
  opacity: 0,
});

css.parentChild(cls.rowsHide, cls.childContainer, {
  borderLeft: `${spacings.borderSize}px solid transparent`,
});

css.class(cls.childContainer, {
  display: "block",
  marginLeft: spacings.spacePerLevel + spacings.rowLeftPadding,
  borderLeft: `${spacings.borderSize}px solid ${colors.border}`,
  transition: "borderLeft 400ms linear",
  //this breaks cardsContainer, need to think on how to handle this
  //also if enabled break collapse\expand animation
  // overflow: "hidden",

  marginTop: -spacings.rowVecticalPadding,
  paddingTop: spacings.rowVecticalPadding,

  marginBottom: -spacings.rowVecticalPadding,
  paddingBottom: spacings.rowVecticalPadding,
});

css.parentHover(cls.row, cls.chevron, {
  opacity: 1,
});
css.selector(`.${cls.row}.${cls.rowSelected} .${cls.chevron}`, {
  opacity: 1,
});

css.class(cls.chevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  opacity: 0,
  transition: `transform ${timings.itemExpandCollapseDuration}ms, opacity 100ms`,
  cursor: "pointer",
  color: colors.mediumPrimary,
  userSelect: "none",
});

css.class(cls.chevronInactive, {
  pointerEvents: "none",
  visibility: "hidden",
});

css.hover(cls.chevron, {
  color: colors.darkPrimary,
});

css.class(cls.chevronOpen, {
  transform: "rotateZ(90deg)",
});

css.class(cls.rowText, {
  fontWeight: 500,
  outline: "none",

  //centering text relative to the image in a row
  minHeight: 32,
  display: "flex",
  alignItems: "center",
  verticalAlign: "middle",
  marginTop: -2,
});
css.class(cls.rowTextVideo, {
  fontWeight: 400,
  fontSize: 15,
});

css.selection(cls.rowText, {
  background: colors.lightPrimary,
});
