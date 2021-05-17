import { dom, cls, style, cssVar, css } from "../browser";
import { spacings, timings, icons } from "../designSystem";
import { ReadonlyItemModel } from "../model/ItemModel";

type Props = {
  focusOn: Action<ReadonlyItemModel>;
  container: Element;
};
class HeaderView {
  lastSeparator?: Element;
  constructor(private props: Props) {}

  initHeader(rootModel: ReadonlyItemModel) {
    this.lastSeparator = this.viewSeparator(rootModel);
    this.props.container.appendChild(
      dom.fragment([
        dom.div({
          className: cls.headerIconContainer,
          children: [
            icons.chevron({ classNames: [cls.headerIcon, cls.headerBackIcon] }),
          ],
        }),
        dom.div({
          className: cls.headerIconContainer,
          children: [icons.chevron({ className: cls.headerIcon })],
        }),
        dom.div({
          className: cls.headerIconContainer,
          children: [icons.home({ className: cls.headerIcon })],
          onClick: () => this.props.focusOn(rootModel),
        }),
        this.lastSeparator,
      ])
    );
  }

  renderPath(models: ReadonlyItemModel[]) {
    if (this.lastSeparator) {
      while (this.lastSeparator.nextSibling)
        this.lastSeparator.nextSibling.remove();

      for (let i = 0; i < models.length; i += 1) {
        const model = models[i];
        const nextModel = models[i + 1];

        this.props.container.appendChild(
          this.viewItemWithSeparator(model, nextModel)
        );
      }
    }
  }

  viewItemWithSeparator = (
    model: ReadonlyItemModel,
    nextItem?: ReadonlyItemModel
  ) =>
    dom.fragment([
      dom.div({
        className: cls.headerPathText,
        onClick: () => this.props.focusOn(model),
        children: [model.get("title")],
      }),
      this.viewSeparator(model, nextItem),
    ]);

  viewSeparator = (model: ReadonlyItemModel, nextItem?: ReadonlyItemModel) => {
    const contextMenu = dom.div({ className: cls.headerContextMenu });
    const onEnter = () => {
      const addItem = (child: ReadonlyItemModel) => {
        contextMenu.appendChild(
          dom.div({
            className: cls.headerContextMenuItem,
            classMap: { [cls.headerContextMenuItemActive]: child == nextItem },
            children: [child.get("title")],
            onClick: () => this.props.focusOn(child),
          })
        );
      };

      model.getChildren().forEach((c) => addItem(c));

      contextMenu.classList.add(cls.headerContextMenuVisible);
    };
    const onLeave = () => {
      contextMenu.innerHTML = ``;
      contextMenu.classList.remove(cls.headerContextMenuVisible);
    };
    return dom.div({
      className: cls.headerPathSeparator,
      onEnter,
      onLeave,
      children: [
        icons.lightChevron({
          className: cls.headerPathSeparatorIcon,
        }),
        contextMenu,
      ],
    });
  };
}

style.class(cls.header, {
  position: "relative",
  height: spacings.headerHeight,
  transition: css.transition({ backgroundColor: timings.themeSwitchDuration }),
  backgroundColor: css.useVar(cssVar.mainBackground),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

style.after(cls.header, {
  position: "absolute",
  left: 0,
  right: 0,
  top: "100%",
  height: 6,
  content: `" "`,
  boxShadow: `#000000 0 6px 6px -6px inset`,
});

//First three icons
style.class(cls.headerIconContainer, {
  marginLeft: 5,
  width: 36,
  height: 36,
  borderRadius: 36 / 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  onHover: { backgroundColor: css.useVar(cssVar.backgroundHover) },
  active: { backgroundColor: css.useVar(cssVar.halfAccent) },
});

style.class(cls.headerIcon, {
  height: 22,
  width: 22,
});

style.class(cls.headerBackIcon, {
  transform: "rotateZ(180deg)",
});

//PAth text and icon
style.class(cls.headerPathText, {
  fontSize: 14,
  padding: css.padding(0, 4),
  cursor: "pointer",
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  onHover: { backgroundColor: css.useVar(cssVar.backgroundHover) },
});

style.class(cls.headerPathSeparatorIcon, {
  height: 8,
  width: 8,
  transition: "transform 200ms",
});
style.class(cls.headerPathSeparator, {
  width: 20,
  paddingTop: 2,
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

style.parentHover(cls.headerPathSeparator, cls.headerPathSeparatorIcon, {
  transform: "rotateZ(90deg)",
});

///CONTEXT MENY
style.class(cls.headerContextMenu, {
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity .2s,transform .2s",
  transform: "translate3d(0,6px,0)",
  position: "absolute",
  top: spacings.headerHeight,
  left: -20,
  minWidth: 200,
  zIndex: 10,
  boxShadow: "0px 2px 2px rgba(0,0,0,0.25)",
  backgroundColor: css.useVar(cssVar.mainBackground),

  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  fontSize: 14,
  //   backgroundColor: colors.buttonHover,
});
style.class(cls.headerContextMenuVisible, {
  pointerEvents: "all",
  opacity: 1,
  transform: "translateZ(0)",
});

style.class(cls.headerContextMenuItem, {
  cursor: "pointer",
  padding: "2px 5px",
  onHover: { backgroundColor: css.useVar(cssVar.backgroundHover) },
});

style.class(cls.headerContextMenuItemActive, { fontWeight: "bold" });
export default HeaderView;
