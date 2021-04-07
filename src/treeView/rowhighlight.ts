import { items } from "../domain";
import { cls, css, utils } from "../infra";
import { Row } from "./row";

class RowSelector extends HTMLElement {
  selectedItem: Item | undefined;

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.selectedItem) {
        const previousItem = items.getPreviousItem(this.selectedItem);

        if (previousItem) {
          let itemToSelect = previousItem;
          while (items.isFolderOpenOnPage(itemToSelect)) {
            itemToSelect = utils.lastArrayItem(
              items.getChildrenFor(itemToSelect.id)
            );
          }

          this.selectItem(itemToSelect);
        } else {
          this.selectParent();
        }
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.selectedItem) {
        if (
          items.isFolderOpenOnPage(this.selectedItem) &&
          !items.isEmpty(this.selectedItem)
        ) {
          this.selectFirstChildOf(this.selectedItem);
        } else {
          const nextItem = items.getNextItem(this.selectedItem);
          if (nextItem) {
            this.selectItem(nextItem);
          } else {
            const isLastItem = (child: Item, parent: ItemContainer) =>
              parent.children.indexOf(child.id) == parent.children.length - 1;

            let parent = items.getParent(this.selectedItem.id);

            let child = this.selectedItem;
            while (parent && isLastItem(child, parent)) {
              child = parent;
              parent = items.getParent(parent.id);
              console.log("42");
            }

            this.selectItem(items.getNextItem(child));
          }
        }
      } else {
        const itemInFocus = items.getFocusedItem();
        this.selectFirstChildOf(itemInFocus);
      }
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();

      if (this.selectedItem && !items.isFolderOpenOnPage(this.selectedItem)) {
        this.getRowElemByItemId(this.selectedItem).toggleItemVisibility();
      } else if (this.selectedItem) {
        this.selectFirstChildOf(this.selectedItem);
      }
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (this.selectedItem && items.isFolderOpenOnPage(this.selectedItem)) {
        this.getRowElemByItemId(this.selectedItem).toggleItemVisibility();
      } else if (this.selectedItem) {
        this.selectParent();
      }
    }
  };

  selectFirstChildOf(item: Item) {
    const firstChild = items.getChildrenFor(item.id)[0];
    if (firstChild) this.selectItem(firstChild);
  }
  selectParent() {
    if (this.selectedItem) {
      const parent = items.getParent(this.selectedItem.id);

      if (parent && parent.id !== items.getFocusedItem().id)
        this.selectItem(parent);
    }
  }

  unSelectCurrentItem() {
    if (this.selectedItem) {
      const elem = this.getRowElemByItemId(this.selectedItem);
      elem.classList.remove(cls.rowSelected);
    }
  }

  getRowElemByItemId = ({ id, title }: Item): Row => {
    const elem = document.getElementById("row-" + id) as Row;
    if (!elem) {
      throw new Error(
        "Can not find element for an item with id: " + id + ` (${title})`
      );
    }
    return elem;
  };

  connectedCallback() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  selectItem = (item: Item | undefined) => {
    if (item) {
      this.unSelectCurrentItem();
      this.selectedItem = item;

      const elem = this.getRowElemByItemId(this.selectedItem);
      elem.classList.add(cls.rowSelected);

      this.style.top = elem.offsetTop + "px";
      this.style.height = elem.offsetHeight + "px";
    }
  };
}

customElements.define("slp-row-selection", RowSelector);
let highlighter: RowSelector | undefined;
export const viewHighlighter = () => {
  highlighter = document.createElement("slp-row-selection") as RowSelector;
  return highlighter;
};

export const selectItem = (item: Item) => {
  if (highlighter) highlighter.selectItem(item);
};

css.selector("slp-row-selection", {
  position: "absolute",
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.08)",
  pointerEvents: "none",
  ...css.transition({ top: 100, height: 100 }),
});
