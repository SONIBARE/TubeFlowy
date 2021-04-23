import { anim, cls, css, dom, timings } from "./infra";

export class RowSelector {
  selectedItemId: string | undefined;
  highlightElement: HTMLElement;
  constructor() {
    this.highlightElement = dom.div({ className: cls.treeRowHighlight });
  }

  selectItem = (itemId: string | undefined) => {
    this.unselectCurrentItem();
    this.selectedItemId = itemId;
    if (itemId) {
      const rowElement = document.getElementById("row-" + itemId)!;
      dom.addClass(rowElement, cls.rowSelected);
      if (this.highlightElement.isConnected) {
        const targetRect = rowElement.getBoundingClientRect();
        const currentRect = this.highlightElement.getBoundingClientRect();
        const diff = currentRect.top - targetRect.top;
        rowElement.appendChild(this.highlightElement);
        anim.animate(
          this.highlightElement,
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
        rowElement.appendChild(this.highlightElement);
      }
    }
  };

  unselectCurrentItem = () => {
    if (this.selectedItemId) {
      const rowElement = document.getElementById("row-" + this.selectedItemId)!;
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
