import { items } from "../domain";
import { cls, colors, css, dom, spacings } from "../infra";
import FolderIcon from "./FolderIcon";

//DND state
let initialMousePosition: Vector;
let dragAvatar: HTMLElement | undefined;
let dragDestination: HTMLElement | undefined;
let itemBeingDragged: Item | undefined;
let itemUnder: Item | undefined;
let dropPlacement: DropPlacement;

export const onItemMouseDown = (item: Item, e: MouseEvent) => {
  document.body.style.userSelect = "none";
  document.body.style.cursor = "grabbing";

  itemBeingDragged = item;
  initialMousePosition = getScreenPosition(e);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

export const onItemMouseMove = (item: Item, e: MouseEvent) => {
  if (dragAvatar) {
    itemUnder = item;
    if (!dragDestination) {
      dragDestination = dom.div(
        { className: cls.dragDestination },
        dom.div({
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
  if (e.buttons == 1 && itemBeingDragged) {
    if (!dragAvatar) {
      const dist = distance(initialMousePosition, getScreenPosition(e));
      if (dist > 5) {
        const icon = new FolderIcon(itemBeingDragged);
        icon.update();
        dragAvatar = dom.div({ className: cls.dragAvatar }, icon.render());
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
  const outerCircle = rowUnder.getElementsByClassName(cls.focusCircleSvg)[0]!;
  const circleRect = outerCircle.getBoundingClientRect();
  const left = circleRect.left + spacings.outerRadius - BULP_RADIUS;

  const rect = rowUnder.getBoundingClientRect();

  const mousePosition = getScreenPosition(e);
  const isOnTheLowerHalf = mousePosition.y > rect.top + rect.height / 2;

  let isInside = 0;

  if (isOnTheLowerHalf) {
    dropPlacement = "after";
    dragDestination.style.top = rect.bottom - 1 + "px";
  } else {
    dragDestination.style.top = rect.top - 1 + "px";
    dropPlacement = "before";
  }

  if (
    mousePosition.x > circleRect.left + spacings.outerRadius * 2 &&
    isOnTheLowerHalf
  ) {
    dropPlacement = "inside";
    isInside = 1;
  }
  dragDestination.style.left = left + isInside * spacings.spacePerLevel + "px";
};

const onMouseUp = () => {
  drop();
  finishDrag();
};

const drop = () => {
  if (itemBeingDragged && itemUnder) {
    if (dropPlacement === "after")
      items.moveItemAfter(itemBeingDragged.id, itemUnder.id);
    if (dropPlacement === "before")
      items.moveItemBefore(itemBeingDragged.id, itemUnder.id);
    if (dropPlacement === "inside")
      items.moveItemInside(itemBeingDragged.id, itemUnder.id);
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
  document.body.style.removeProperty("user-select");
  document.body.style.removeProperty("cursor");
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

interface Vector {
  x: number;
  y: number;
}

//accessing clientX is ugly, but I have no other way to pass pageX from tests
//https://github.com/testing-library/dom-testing-library/issues/144
//https://github.com/jsdom/jsdom/issues/1911
const getScreenPosition = (e: MouseEvent): Vector => ({
  x: e.pageX || e.clientX,
  y: e.pageY || e.clientY,
});

const distance = (a1: Vector, a2: Vector) => {
  const xDiff = a1.x - a2.x;
  const yDiff = a1.y - a2.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

css.class(cls.dragAvatar, {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 200,
});

css.class(cls.dragDestination, {
  position: "fixed",
  pointerEvents: "none",
  height: 2,
  backgroundColor: colors.darkPrimary,
  width: 300,
  zIndex: 100,
});
const BULP_RADIUS = 4;
css.class(cls.dragDestinationBulp, {
  position: "absolute",
  height: BULP_RADIUS * 2,
  width: BULP_RADIUS * 2,
  left: 0,
  top: -3,
  backgroundColor: colors.darkPrimary,
});
