import { focusItem } from "./treeView/focuser";
import {
  button,
  cls,
  colors,
  css,
  div,
  spacings,
  zIndexes,
  icons,
  fragment,
} from "./infra";
import { showSearchPanel } from "./searchResults/searchPage";
import { items, events } from "./domain";
import { saveState } from "./api/stateLoader";

export const header = (): HTMLDivElement => {
  const pathText = (item: Item, previousItem: Item): HTMLElement[] => {
    const onEnter = () => {
      contextMenu.innerHTML = ``;
      const row = (subItem: Item) =>
        div(
          {
            className: cls.headerContextMenuItem,
            classMap: { [cls.headerContextMenuItemActive]: subItem == item },
            events: { click: () => focusItem(subItem) },
          },
          subItem.title
        );
      contextMenu.appendChild(
        fragment(items.getChildrenFor(previousItem.id).map(row))
      );
      contextMenu.classList.add(cls.headerContextMenuVisible);
    };

    const onLeave = () => {
      contextMenu.classList.remove(cls.headerContextMenuVisible);
    };
    const contextMenu = div({ className: cls.headerContextMenu });

    return [
      div(
        {
          className: cls.headerPathSeparator,
          events: {
            mouseenter: onEnter,
            mouseleave: onLeave,
          },
        },
        icons.lightChevron({
          className: cls.lightChevronIcon,
        }),
        contextMenu
      ),
      div(
        {
          className: cls.headerPathText,
          events: { click: () => focusItem(item) },
        },
        item.title
      ),
    ];
  };
  let htmlParts: HTMLElement[] = [];

  const onFocused = (item: Item) => {
    if (item.id == "HOME") home.classList.add(cls.headerIconInactive);
    else home.classList.remove(cls.headerIconInactive);

    const parts = items.getNodePath(item.id);
    const htmlPartsUnflattered: HTMLElement[][] = [];
    for (let index = 1; index < parts.length; index++) {
      const item = parts[index];
      const prevItem = parts[index - 1];
      htmlPartsUnflattered.push(pathText(item, prevItem));
    }
    htmlParts.forEach((p) => p.remove());

    htmlParts = htmlPartsUnflattered.flat().reverse();
    htmlParts.forEach((p) => {
      home.insertAdjacentElement("afterend", p);
    });
  };

  const home = headerButton(icons.home({ className: cls.headerIcon }), () =>
    focusItem(items.getRoot())
  );
  events.addEventListener("item-focused", onFocused);

  return div(
    { className: cls.header },
    headerButton(
      icons.chevron({
        className: [cls.headerIcon, cls.headerBackButton],
      }),
      () => focusItem(items.getRoot())
    ),
    headerButton(icons.chevron({ className: cls.headerIcon })),
    home,
    div(
      {
        className: [cls.headerIconContainer, cls.headerPullRight],
        events: { click: showSearchPanel },
      },
      icons.search({ className: [cls.headerIcon] })
    ),
    button({
      className: cls.saveButton,
      text: "Save",
      events: { click: saveState },
    })
  );
};

const headerButton = (icon: SVGElement, onClick?: EmptyFunc) =>
  div({ className: cls.headerIconContainer, events: { click: onClick } }, icon);

css.class(cls.header, {
  paddingLeft: 40,
  gridArea: "header",
  position: "relative",
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

css.class(cls.headerIconInactive, {
  color: colors.mediumPrimary,
  pointerEvents: "none",
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
  width: 20,
  paddingTop: 2,
  alignSelf: "stretch",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

css.parentHover(cls.headerPathSeparator, cls.lightChevronIcon, {
  transform: "rotateZ(90deg)",
});

css.class(cls.headerPathText, {
  fontSize: 14,
  padding: "0 4px",
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

css.class2(cls.headerPathText, cls.headerPathTextCurrent, {
  textDecoration: "none",
  cursor: "initial",
  fontWeight: "bold",
  backgroundColor: "inherit",
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

css.class(cls.headerContextMenuVisible, {
  pointerEvents: "all",
  opacity: 1,
  transform: "translateZ(0)",
});

css.class(cls.saveButton, {
  margin: "0 10px",
});

css.class(cls.headerPullRight, {
  marginLeft: "auto",
});
