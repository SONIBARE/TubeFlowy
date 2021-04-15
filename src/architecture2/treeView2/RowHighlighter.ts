import { anim, cls, colors, css, dom } from "../../infra";
import { items, MyEvents } from "../domain";

export class RowHighliter {
  cleanup: EmptyFunc;
  currentElem: HTMLElement;
  constructor() {
    this.cleanup = items.onAnyItemClick(this.renderRow);
    this.currentElem = dom.div({ className: cls.treeRowHighlight });
  }

  renderRow = (payload: MyEvents["item-click"]) => {
    if (this.currentElem.isConnected) {
      console.log(";foooo");
      const targetRect = payload.rowElement.getBoundingClientRect();
      const currentRect = this.currentElem.getBoundingClientRect();
      const diff = currentRect.top - currentRect.top;
      payload.rowElement.appendChild(this.currentElem);
      anim.animate(
        this.currentElem,
        [
          { top: diff, height: this.currentElem.clientHeight },

          { top: 0, height: targetRect.height },
        ],
        {
          duration: 200,
        }
      );
    } else {
      console.log(";appendChild232232434343232");
      payload.rowElement.appendChild(this.currentElem);
    }
  };
}

css.class(cls.treeRowHighlight, {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.08)",
  zIndex: -1,
});
