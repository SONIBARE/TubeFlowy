import {
  cls,
  css,
  fragment,
  div,
  anim,
  colors,
  spacings,
  timings,
} from "../infra";
import { events, items } from "../domain";
import { renderRow } from "./row";

export class RowWithChildren extends HTMLElement {
  unsub!: EmptyFunc;
  item!: Item;

  childContainer: HTMLElement | undefined;
  render(item: Item) {
    this.item = item;
    const elem = this;

    const appendChildren = (item: Item) => {
      this.childContainer = div(
        { className: cls.childContainer },
        fragment(items.getChildrenFor(item.id).map(rowWithChildren))
      );
      elem.appendChild(this.childContainer);
    };

    const onAnimationFinish = (item: Item) => {
      if (!items.isFolderOpenOnPage(item) && this.childContainer) {
        this.childContainer.remove();
        this.childContainer = undefined;
      }
      items.redrawCanvas();
    };

    const animateChildren = (item: Item) => {
      if (
        this.childContainer &&
        anim.revertCurrentAnimations(this.childContainer)
      ) {
      } else if (items.isFolderOpenOnPage(item)) {
        appendChildren(item);
        if (this.childContainer)
          anim
            .expandHeight(this.childContainer)
            .addEventListener("finish", () => onAnimationFinish(item));
      } else {
        if (this.childContainer) {
          anim
            .collapseHeight(this.childContainer)
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
      }
    });
    elem.appendChild(row);

    if (items.isFolderOpenOnPage(item)) {
      appendChildren(item);
    }

    this.unsub = events.addCompoundEventListener(
      "item-collapse",
      item.id,
      animateChildren
    );
  }

  moveItemRelativeTo(
    dropPlacement: DropPlacement,
    relativeTo: RowWithChildren
  ) {
    const itemBeingDragged = this.item;
    const itemUnder = relativeTo.item;

    const copy = () => rowWithChildren(itemBeingDragged);

    //here I take item out from the dom and place it in a different place
    //I don't want to unsubscribe from app events, so I halt
    if (dropPlacement === "after") {
      items.moveItemAfter(itemBeingDragged.id, itemUnder.id);
      this.remove();
      relativeTo.insertAdjacentElement("afterend", copy());
    } else if (dropPlacement === "before") {
      items.moveItemBefore(itemBeingDragged.id, itemUnder.id);
      this.remove();
      relativeTo.insertAdjacentElement("beforebegin", copy());
    } else {
      items.moveItemInside(itemBeingDragged.id, itemUnder.id);
      //asumes node is open
      const children = relativeTo.getElementsByClassName(cls.childContainer)[0];

      this.remove();
      if (children) children.insertAdjacentElement("afterbegin", copy());
    }
  }

  disconnectedCallback() {
    if (this.unsub) this.unsub();
  }
}

customElements.define("slp-item", RowWithChildren);

export const rowWithChildren = (item: Item) => {
  const elem = document.createElement("slp-item") as RowWithChildren;
  elem.render(item);
  return elem;
};
