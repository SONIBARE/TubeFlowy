import {
  cls,
  colors,
  compose,
  css,
  dom,
  icons,
  spacings,
  timings,
} from "../../infra";
import { items } from "../domain";
import FolderIcon from "./FolderIcon";

export const row = (item: Item, level: number, onRemove: EmptyFunc) => {
  const chevron = viewChevron(item);
  const itemIcon = new FolderIcon(item);

  const onItemCollapse = () => {
    itemIcon.update();
    dom.toggleClass(chevron, cls.chevronOpen, items.isFolderOpenOnPage(item));
  };

  onItemCollapse();
  const cleanup = items.onItemCollapseExpand(item.id, onItemCollapse);

  return dom.div(
    {
      id: "row-" + item.id,
      className: [cls.treeRow, ("level_" + level) as any],
      onRemovedFromDom: compose(onRemove, cleanup, itemIcon.cleanup),
    },
    chevron,
    itemIcon.render(),
    dom.span({ className: cls.rowText }, item.title)
  );
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

const numberOfLevelsToGenerate = 21;

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
