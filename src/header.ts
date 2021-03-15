import { focusItem } from "./focuser";
import { cls, colors, css, div, spacings, zIndexes } from "./infra";
import { chevron, home, lightChevron } from "./infra/icons";
import { store } from "./state";

export const appendHeader = (container: HTMLElement) =>
  container.appendChild(header());

const header = () =>
  div(
    { className: cls.header },
    headerButton(
      chevron({
        className: [cls.headerIcon, cls.headerBackButton],
      }),
      () => focusItem(store.getRoot())
    ),
    headerButton(chevron({ className: cls.headerIcon })),
    headerButton(home({ className: cls.headerIcon })),
    div(
      { className: cls.headerPathSeparator },
      lightChevron({
        className: cls.lightChevronIcon,
      })
    ),
    div({ className: cls.headerPathText }, "Music"),
    div(
      { className: cls.headerPathSeparator },
      lightChevron({
        className: cls.lightChevronIcon,
      }),
      div(
        { className: cls.headerContextMenu },
        div({ className: cls.headerContextMenuItem }, "Some Music children"),
        div({ className: cls.headerContextMenuItem }, "Some Music children"),
        div(
          {
            className: [
              cls.headerContextMenuItem,
              cls.headerContextMenuItemActive,
            ],
          },
          "Some Music children"
        ),
        div({ className: cls.headerContextMenuItem }, "Some Music children")
      )
    ),
    div({ className: cls.headerPathText }, "Metal"),
    div(
      { className: cls.headerPathSeparator },
      lightChevron({
        className: cls.lightChevronIcon,
      })
    ),
    div(
      { className: [cls.headerPathText, cls.headerPathTextActive] },
      "Fuck Me"
    )
  );

const headerButton = (icon: SVGElement, onClick?: EmptyFunc) =>
  div({ className: cls.headerIconContainer, onClick }, icon);

css.class(cls.header, {
  paddingLeft: 40,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: spacings.headerHeight,
  backgroundColor: "white",
  zIndex: zIndexes.header,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  color: colors.darkPrimary,
});

css.text(`
.${cls.header}::after{
    position: absolute;
    left: 0px;
    right: 0px;
    top: 100%;
    height: 4px;
    content: " ";
    background: linear-gradient(
        rgba(9, 30, 66, 0.13) 0px, 
        rgba(9, 30, 66, 0.13) 1px, 
        rgba(9, 30, 66, 0.08) 1px, 
        rgba(9, 30, 66, 0) 4px);
}
`);

css.class(cls.headerIconContainer, {
  marginLeft: 5,
  width: 36,
  height: 36,
  borderRadius: 36 / 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
});

css.hover(cls.headerIconContainer, {
  backgroundColor: colors.buttonHover,
});

css.active(cls.headerIconContainer, {
  backgroundColor: colors.lightPrimary,
});

css.class(cls.headerIcon, {
  height: 22,
  width: 22,
});

css.class(cls.headerBackButton, {
  transform: "rotateZ(180deg)",
});

css.class(cls.lightChevronIcon, {
  height: 8,
  width: 8,
  transition: "transform 200ms",
});
css.class(cls.headerPathSeparator, {
  width: 16,
  paddingTop: 2,
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

css.hover(cls.headerPathSeparator, {
  //   backgroundColor: colors.buttonHover,
});

css.parentHover(cls.headerPathSeparator, cls.lightChevronIcon, {
  transform: "rotateZ(90deg)",
});

css.class(cls.headerPathText, {
  fontSize: 14,
  padding: "0 2px",
  cursor: "pointer",
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

css.hover(cls.headerPathText, {
  backgroundColor: colors.buttonHover,
});

css.active(cls.headerPathText, {
  backgroundColor: colors.lightPrimary,
});

css.class2(cls.headerPathText, cls.headerPathTextActive, {
  textDecoration: "none",
  cursor: "inherit",
  fontWeight: "bold",
});

css.class(cls.headerContextMenu, {
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity .2s,transform .2s",
  transform: "translate3d(0,6px,0)",
  position: "absolute",
  top: spacings.headerHeight,
  left: "-20px",
  minWidth: "200px",
  zIndex: 10,
  boxShadow: "0px 2px 2px rgba(0,0,0,0.25)",
  backgroundColor: "white",

  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  fontSize: 14,
  //   backgroundColor: colors.buttonHover,
});

css.class(cls.headerContextMenuItem, {
  cursor: "pointer",
  padding: "2px 5px",
});
css.hover(cls.headerContextMenuItem, {
  backgroundColor: colors.lightPrimary,
});

css.class(cls.headerContextMenuItemActive, {
  fontWeight: "bold",
});

css.parentHover(cls.headerPathSeparator, cls.headerContextMenu, {
  pointerEvents: "all",
  opacity: 1,
  transform: "translateZ(0)",
});
