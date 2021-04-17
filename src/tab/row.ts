import {
  cls,
  colors,
  compose,
  css,
  dom,
  icons,
  spacings,
  timings,
} from "../infra";
import { onItemMouseMove } from "./dnd";
import { items } from "../domain";
import FolderIcon from "./FolderIcon";

export const row = (item: Item, level: number, onRemove: EmptyFunc) => {
  const chevron = viewChevron(item);
  const itemIcon = new FolderIcon(item);

  const updateRowIcons = () => {
    itemIcon.update();
    dom.toggleClass(
      chevron,
      cls.chevronInactive,
      items.isEmptyAndNoNeedToLoad(item)
    );
    dom.toggleClass(chevron, cls.chevronOpen, items.isFolderOpenOnPage(item));
  };

  updateRowIcons();

  const startRename = () => {
    res.getElementsByClassName(cls.rowText)[0].remove();
    const input = dom.input({
      testId: "item-titleInput-" + item.id,
      value: item.title,
      className: cls.rowTextInput,
      events: {
        input: (e) => items.setTitle(item.id, e.currentTarget.value),
        keydown: (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Enter") e.currentTarget.blur();
        },
        blur: stopRename,
      },
    });
    res.appendChild(input);
    input.focus();
  };
  const stopRename = () => {
    const input = res.getElementsByClassName(cls.rowTextInput)[0];
    if (input) {
      input.remove();
      res.appendChild(dom.span({ className: cls.rowText }, item.title));
    }
  };

  const cleanup = compose(
    items.onItemCollapseExpand(item.id, updateRowIcons),
    items.onItemChildrenChanged(item.id, updateRowIcons),
    items.onItemEvent("item-rename-start", item.id, startRename),
    items.onItemEvent("item-rename-stop", item.id, stopRename)
  );

  const res = dom.div(
    {
      id: "row-" + item.id,
      className: [cls.treeRow, ("level_" + level) as any],
      onRemovedFromDom: compose(onRemove, cleanup, itemIcon.cleanup),
      events: {
        click: () => items.itemClick(item),
        mousemove: (e) => onItemMouseMove(item, e),
      },
    },
    chevron,
    itemIcon.render(),
    dom.span({ className: cls.rowText }, item.title)
  );
  return res;
};

const viewChevron = (item: Item) =>
  icons.chevron({
    className: cls.chevron,
    testId: "chevron-" + item.id,
    events: {
      click: (e) => {
        e.stopPropagation();
        items.toggleItemVisibility(item);
      },
    },
  });

const numberOfLevelsToGenerate = 11;

const borderWidth = 2;
const TREE_MAX_WIDTH = 700;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  const base = `max((100% - ${TREE_MAX_WIDTH}px) / 2, 20px)`;
  const levelPadding = `${level * spacings.spacePerLevel}px`;
  css.class(`level_${level}` as any, {
    paddingLeft: `calc(${base} + ${levelPadding})`,
    paddingRight: 20,
  });
  css.class(`children-level_${level}` as any, {
    left: `calc(${base} + ${
      level * spacings.spacePerLevel +
      spacings.chevronSize +
      spacings.outerRadius -
      borderWidth / 2
    }px)`,
  });
}

css.class(cls.treeRow, {
  cursor: "pointer",
  //used to position selection row
  position: "relative",
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
  paddingTop: 4,
  paddingBottom: 4,
});

css.hover(cls.treeRow, {
  backgroundColor: colors.superLight,
});

css.class(cls.rowText, {
  paddingTop: 2,
  lineHeight: 1.6,
});
css.class(cls.rowTextInput, {
  marginTop: 2,
  lineHeight: 1.6,
  fontSize: 16,
  width: "100%",
  border: "none",
  outline: "none",
  padding: 0,
  backgroundColor: "transparent",
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

css.class(cls.chevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  ...css.transition({
    transform: timings.itemExpandCollapseDuration,
    opacity: 100,
  }),
  cursor: "pointer",
  color: colors.mediumPrimary,
  opacity: 0,
  userSelect: "none",
});

css.parentHover(cls.treeRow, cls.chevron, {
  opacity: 1,
});

css.hover(cls.chevron, {
  color: colors.darkPrimary,
});

css.class(cls.chevronOpen, {
  transform: "rotateZ(90deg)",
});

css.class(cls.chevronInactive, {
  pointerEvents: "none",
  visibility: "hidden",
});
