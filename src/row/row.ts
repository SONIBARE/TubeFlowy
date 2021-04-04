import { cls, compose, div, icons } from "../infra";
import { events, items } from "../domain";
import { loadItemChildren } from "../api/youtube";
import * as dnd from "../dnd";
import { RowWithChildren } from "./rowWithChildren";
import { itemImage } from "./itemImage";
import { folderIcon } from "./folderIcon";
import { placeOver } from "./rowhighlight";

class Row extends HTMLElement {
  onUnsub!: () => void;

  render(item: Item, rowWithChildren: RowWithChildren) {
    const animateChevron = (item: Item) => {
      if (items.isFolderOpenOnPage(item)) chev.classList.add(cls.chevronOpen);
      else chev.classList.remove(cls.chevronOpen);
    };

    const onChevronClick = () => {
      if (items.isNeedsToBeLoaded(item)) {
        loadItemChildren(item).then((r) => {
          items.itemLoaded(item.id, r);
          items.toggleFolderVisibility(item.id);
        });
      } else {
        items.toggleFolderVisibility(item.id);
      }
    };
    const chev = icons.chevron({
      className: cls.chevron,
      testId: "chevron-" + item.id,
      events: { click: onChevronClick },
    });

    const rowText = div(
      {
        className: [
          cls.rowText,
          items.isVideo(item) ? cls.rowTextVideo : cls.none,
        ],
        contentEditable: true,
        events: {
          focus: (e) => {
            this.classList.add(cls.rowFocused);
            placeOver(e.currentTarget);
          },
          focusout: () => {
            this.classList.remove(cls.rowFocused);
          },
          input: ({ currentTarget }) => {
            items.setTitle(item, currentTarget.textContent || "");
          },
          keydown: (e) => {
            if (e.key === "Backspace" && e.shiftKey && e.ctrlKey) {
              items.removeItem(item);
              rowWithChildren.remove();
            }
            if (e.key == "ArrowUp") {
              e.preventDefault();
              const previous = rowWithChildren.previousElementSibling;
              if (previous) playCaretAtTextAtRow(previous as HTMLElement);
            }
            if (e.key == "ArrowDown") {
              e.preventDefault();
              const next = rowWithChildren.nextElementSibling;
              if (next) playCaretAtTextAtRow(next as HTMLElement);
            }
          },
        },
      },
      item.title
    );
    const unsub2 = events.addCompoundEventListener(
      "item-collapse",
      item.id,
      animateChevron
    );
    this.classList.add(cls.row);
    this.setAttribute("data-testid", "row-" + item.id);
    this.addEventListener("mousemove", (e) =>
      dnd.onItemMouseMove(item, rowWithChildren, e)
    );
    this.appendChild(chev);
    animateChevron(item);

    const onMouseDown = (e: MouseEvent) =>
      dnd.onItemMouseDown(item, rowWithChildren, e);

    const unsub = items.hasImagePreview(item)
      ? itemImage(item, this, onMouseDown)
      : folderIcon(item, this, onMouseDown);

    this.append(rowText);

    this.onUnsub = compose(unsub, unsub2);
  }

  disconnectedCallback() {
    if (this.onUnsub) this.onUnsub();
  }
}

customElements.define("slp-row", Row);

export const renderRow = (item: Item, rowWithChildren: RowWithChildren) => {
  const elem = document.createElement("slp-row") as Row;
  elem.render(item, rowWithChildren);
  return elem;
};

export const playCaretAtTextAtRow = (row: HTMLElement) => {
  const text = row.getElementsByClassName(cls.rowText)[0] as HTMLElement;
  placeCarentAtBeginingOfElement(text);
};

//utility

const placeCarentAtBeginingOfElement = (elem: HTMLElement) => {
  var range = document.createRange();
  var sel = window.getSelection();

  range.setStart(elem, 0);
  range.collapse(true);
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
};
