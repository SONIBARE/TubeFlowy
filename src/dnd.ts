import { cls, colors, css, div, spacings } from "./infra";
import { appendFocusCicrle } from "./rowIcon";
import { events, items } from "./domain";

//DND state
let initialMousePosition: Vector;
let dragAvatar: HTMLElement | undefined;
let dragDestination: HTMLElement | undefined;
let itemBeingDragged: Item;
let itemBeingDraggedElement: HTMLElement | undefined;

let itemUnderElement: HTMLElement | undefined;
let itemUnder: Item;

type DropPlacement = "before" | "after" | "inside";
let dropPlacement: DropPlacement;

export const onItemMouseDown = (
  item: Item,
  itemElem: HTMLElement,
  e: MouseEvent
) => {
  document.body.style.userSelect = "none";
  document.body.style.cursor = "grabbing";

  itemBeingDraggedElement = itemElem;
  itemBeingDragged = item;
  initialMousePosition = getScreenPosiiton(e);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

export const onItemMouseMove = (
  item: Item,
  itemUnderElem: HTMLElement,
  e: MouseEvent
) => {
  if (dragAvatar) {
    itemUnder = item;
    itemUnderElement = itemUnderElem;
    if (!dragDestination) {
      dragDestination = div(
        { className: cls.dragDestination },
        div({
          className: cls.dragDestinationBulp,
          style: {
            borderRadius:
              item.type === "folder" || item.type === "YTchannel" ? 5 : 1,
          },
        })
      );
      document.body.appendChild(dragDestination);
    }
    updateDragDestinationPosition(
      dragDestination,
      e.currentTarget as HTMLElement,
      e
    );
  }
};

const onMouseMove = (e: MouseEvent) => {
  if (e.buttons == 1) {
    if (!dragAvatar) {
      const dist = distance(initialMousePosition, getScreenPosiiton(e));
      if (dist > 5) {
        dragAvatar = div({ className: cls.dragAvatar });
        appendFocusCicrle(itemBeingDragged, dragAvatar, () => undefined);
        document.body.appendChild(dragAvatar);
        updateDragAvatarPosition(dragAvatar, e);
      }
    } else {
      updateDragAvatarPosition(dragAvatar, e);
    }
  } else {
    finishDrag();
  }
};

const updateDragAvatarPosition = (avatar: HTMLElement, e: MouseEvent) => {
  avatar.style.top = e.pageY - spacings.outerRadius + "px";
  avatar.style.left = e.pageX - spacings.outerRadius + "px";
};

const updateDragDestinationPosition = (
  dragDestination: HTMLElement,
  rowUnder: HTMLElement,
  e: MouseEvent
) => {
  const rect = rowUnder.getBoundingClientRect();
  const baseLevel = spacings.rowsContainerLeftPadding;

  const isOnTheLowerHalf = e.pageY > rect.top + rect.height / 2;

  let isInside = 1;

  if (isOnTheLowerHalf) {
    dropPlacement = "after";
    dragDestination.style.top = rect.bottom - 1 + "px";
  } else {
    dragDestination.style.top = rect.top - 1 + "px";
    dropPlacement = "before";
  }

  if (
    e.pageX >
      baseLevel +
        rect.left +
        spacings.negativeMarginForRowAtZeroLevel +
        spacings.rowsContainerLeftPadding +
        spacings.spacePerLevel &&
    isOnTheLowerHalf
  ) {
    dropPlacement = "inside";
    isInside = 2;
  }
  //TODO: there is a small error in this calculation (when placing inside)
  //postponing resolution, since I don't believe this visual accuracy matters now
  dragDestination.style.left =
    rect.left +
    spacings.negativeMarginForRowAtZeroLevel +
    isInside * spacings.spacePerLevel +
    spacings.rowLeftPadding -
    3 +
    "px";
};

const onMouseUp = () => {
  drop();
  finishDrag();
};

const drop = () => {
  if (itemUnderElement && itemBeingDraggedElement) {
    if (dropPlacement === "after") {
      items.moveItemAfter(itemBeingDragged.id, itemUnder.id);
      itemUnderElement.insertAdjacentElement(
        "afterend",
        itemBeingDraggedElement
      );
    } else if (dropPlacement === "before") {
      items.moveItemBefore(itemBeingDragged.id, itemUnder.id);
      itemUnderElement.insertAdjacentElement(
        "beforebegin",
        itemBeingDraggedElement
      );
    } else {
      items.moveItemInside(itemBeingDragged.id, itemUnder.id);
      //asumes node is open
      const children = itemUnderElement.getElementsByClassName(
        cls.childContainer
      )[0];

      if (children)
        children.insertAdjacentElement("afterbegin", itemBeingDraggedElement);
      else {
        itemBeingDraggedElement.remove();
      }
    }
  }
};

const finishDrag = () => {
  if (dragAvatar) {
    dragAvatar.remove();
    dragAvatar = undefined;
  }
  if (dragDestination) {
    dragDestination.remove();
    dragDestination = undefined;
  }
  itemUnderElement = undefined;
  itemBeingDraggedElement = undefined;

  document.body.style.removeProperty("user-select");
  document.body.style.removeProperty("cursor");
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

interface Vector {
  x: number;
  y: number;
}

const getScreenPosiiton = (e: MouseEvent): Vector => ({
  x: e.pageX,
  y: e.pageY,
});

const distance = (a1: Vector, a2: Vector) => {
  const xDiff = a1.x - a2.x;
  const yDiff = a1.y - a2.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

css.class(cls.dragAvatar, {
  position: "fixed",
  pointerEvents: "none",
});

css.class(cls.dragDestination, {
  position: "fixed",
  height: 2,
  backgroundColor: colors.darkPrimary,
  width: 300,
});
css.class(cls.dragDestinationBulp, {
  position: "absolute",
  height: 8,
  width: 8,
  left: 0,
  top: -3,
  backgroundColor: colors.darkPrimary,
});
