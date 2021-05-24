import { cls, css, cssVar, dom, style } from "../../../infra";
import { spacings, levels, icons } from "../../../designSystem";
import { ItemModel, ReadonlyItemModel } from "../../../model/ItemModel";
// import { App } from "../../App";
import ItemIconView from "./ItemIconView";

type ItemViewEvents = {
  chevronClicked: EmptyAction;
  onFocus: EmptyAction;
};
type Props = ItemViewEvents & {
  model: ReadonlyItemModel;
  level: number;
};

export class ItemView {
  chevron: Element;
  icon: ItemIconView;
  title: Element;
  row: Element;

  constructor({ level, model, chevronClicked, onFocus }: Props) {
    this.chevron = icons.chevron({
      onClick: chevronClicked,
      className: cls.rowChevron,
    });
    this.icon = new ItemIconView(model, {
      onFocus,
    });
    this.title = dom.span({ text: model.get("title") });

    this.row = dom.div({
      classNames: [cls.row, levels.classForLevel(level)],
      children: [
        this.chevron,
        this.icon.svg,
        dom.span({ className: cls.rowTitle, text: model.get("title") }),
      ],
      onMouseMove: (e) => null,
      // App.instance.dnd.onItemMouseMove(model as ItemModel, e),
    });
    this.updateIcons(model);
  }

  updateIcons = (model: ReadonlyItemModel) => {
    dom.assignClassMap(this.chevron, {
      [cls.rowChevronOpen]: model.get("isOpen"),
      [cls.rowChevronInactive]: model.isEmpty(),
    });
    this.icon.update(model);
  };

  updateTitle = (title: string) => (this.title.textContent = title);

  getChevronText = (isOpen: boolean) => (isOpen ? "-" : "+");
}

style.class(cls.row, {
  display: "flex",
  cursor: "pointer",
  ...css.paddingVertical(4),
  onHover: {
    backgroundColor: css.useVar(cssVar.backgroundHover),
  },
});

style.class(cls.rowTitle, {
  paddingTop: 2,
  lineHeight: 1.6,
});

style.class(cls.rowChevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  transition: css.transition({
    transform: 200,
    opacity: 100,
  }),
  color: css.useVar(cssVar.halfAccent),
  opacity: 0,
  userSelect: "none",

  onHover: {
    color: "currentColor",
  },
});

style.parentHover(cls.row, cls.rowChevron, { opacity: 1 });
style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});
style.class(cls.rowChevronInactive, {
  pointerEvents: "none",
  visibility: "hidden",
});
