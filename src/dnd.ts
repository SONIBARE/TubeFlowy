import { doc } from "prettier";
import { cls, colors, css, div, spacings } from "./infra";
import { appendFocusCicrle } from "./rowIcon";

//DND state
let initialMousePosition: Vector;
let dragAvatar: HTMLElement | undefined;
let dragDestination: HTMLElement | undefined;
let itemBeingDragged: Item;

export const onItemMouseDown = (item: Item, e: MouseEvent) => {
  document.body.style.userSelect = "none";
  document.body.style.cursor = "grabbing";
  itemBeingDragged = item;
  initialMousePosition = getScreenPosiiton(e);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

export const onItemMouseMove = (item: Item, e: MouseEvent) => {
  if (dragAvatar) {
    const getLevel = (row: HTMLElement) => {
      let level = 0;
      let parent: HTMLElement | null = row;
      while (parent != null) {
        if (parent.classList.contains(cls.childContainer)) level += 1;
        parent = parent.parentElement;
      }
      return level;
    };

    if (!dragDestination) {
      dragDestination = div(
        { className: cls.dragDestination },
        div({ className: cls.dragDestinationBulp })
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
        appendFocusCicrle(itemBeingDragged, dragAvatar);
        document.body.appendChild(dragAvatar);
        updateDragAvatarPosition(dragAvatar, e);
      }
    } else {
      updateDragAvatarPosition(dragAvatar, e);
    }
  } else {
    onMouseUp();
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
  let isInside = 1;
  if (
    e.pageX >
    baseLevel +
      rect.left +
      spacings.negativeMarginForRowAtZeroLevel +
      spacings.rowsContainerLeftPadding +
      spacings.spacePerLevel
  )
    isInside = 2;

  if (e.pageY > rect.top + rect.height / 2) {
    dragDestination.style.top = rect.bottom - 1 + "px";
  } else {
    dragDestination.style.top = rect.top - 1 + "px";
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
  borderRadius: 1,
  left: 0,
  top: -3,
  backgroundColor: colors.darkPrimary,
});
