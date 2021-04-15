import { anim, cls, compose, css, dom, timings, utils } from "../../infra";
import { items, MyEvents } from "../domain";

export class RowHighliter {
  selectedItem: Item | undefined;
  currentElem: HTMLElement;

  cleanup: EmptyFunc;
  constructor() {
    this.cleanup = compose(
      items.onAnyItemClick(this.selectItem),
      this.listenToKeys()
    );
    this.currentElem = dom.div({ className: cls.treeRowHighlight });
  }

  listenToKeys = () => {
    document.addEventListener("keydown", this.onKeyDown);
    return () => document.removeEventListener("keydown", this.onKeyDown);
  };

  onKeyDown = (e: KeyboardEvent) => {
    const keysToWatch = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];

    if (keysToWatch.includes(e.key)) e.preventDefault();

    if (e.key === "ArrowLeft" && e.altKey) {
      e.preventDefault();
      const previsoulyFocusedItem = items.getFocusedItem();
      const parent = items.getParent(previsoulyFocusedItem.id);
      if (parent) {
        items.focusItem(parent.id);
        this.selectItem(previsoulyFocusedItem);
      }
    } else if (!this.selectedItem && keysToWatch.includes(e.key)) {
      const item = items.getFirstChildOf(items.getFocusedItem().id);
      this.selectItem(item);
    } else if (this.selectedItem) {
      if (e.key === "ArrowRight" && e.altKey) {
        e.preventDefault();
        if (this.selectedItem) {
          items.focusItem(this.selectedItem.id);
          this.selectFirstChildOf(this.selectedItem);
        }
      } else if (e.key === "ArrowDown") {
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
            while (
              parent &&
              isLastItem(child, parent) &&
              parent.id !== items.getFocusedItem().id
            ) {
              child = parent;
              parent = items.getParent(parent.id);
            }

            this.selectItem(items.getNextItem(child));
          }
        }
      } else if (e.key === "ArrowUp") {
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
          this.selectParent(this.selectedItem);
        }
      } else if (e.key === "ArrowLeft") {
        if (items.isFolderOpenOnPage(this.selectedItem))
          items.toggleItemVisibility(this.selectedItem);
        else if (this.selectedItem) this.selectParent(this.selectedItem);
      } else if (e.key === "ArrowRight") {
        if (!items.isFolderOpenOnPage(this.selectedItem))
          items.toggleItemVisibility(this.selectedItem);
        else if (this.selectedItem) this.selectFirstChildOf(this.selectedItem);
      }
    }
  };

  selectFirstChildOf = (parent: Item) =>
    this.selectItem(items.getFirstChildOf(parent.id));

  selectParent = (item: Item) => {
    const parent = items.getParent(item.id);
    if (parent && parent.id !== items.getFocusedItem().id)
      this.selectItem(parent);
  };

  selectItem = (item: Item | undefined) => {
    if (!item) return;
    this.unselectCurrentItem();
    this.selectedItem = item;
    const rowElement = document.getElementById("row-" + item.id)!;
    dom.addClass(rowElement, cls.rowSelected);
    if (this.currentElem.isConnected) {
      const targetRect = rowElement.getBoundingClientRect();
      const currentRect = this.currentElem.getBoundingClientRect();
      const diff = currentRect.top - targetRect.top;
      rowElement.appendChild(this.currentElem);
      anim.animate(
        this.currentElem,
        [
          { top: diff, height: currentRect.height },
          { top: 0, height: targetRect.height },
        ],
        {
          duration: timings.selectionMove,
          fill: "forwards",
        }
      );
    } else {
      rowElement.appendChild(this.currentElem);
    }
  };

  unselectCurrentItem = () => {
    if (this.selectedItem) {
      const rowElement = document.getElementById(
        "row-" + this.selectedItem.id
      )!;
      if (rowElement) dom.removeClass(rowElement, cls.rowSelected);
    }
  };
}

css.class(cls.treeRowHighlight, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 40,
  backgroundColor: "rgba(0,0,0,0.08)",
  pointerEvents: "none",
});
