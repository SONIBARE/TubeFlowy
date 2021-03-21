import { header } from "./header";
import { cls, css, div, fragment, colors, spacings } from "./infra";
import { items } from "./playgrounds/slapstukLegacyItems";
import { myRow } from "./row";
import { minimap } from "./minimap";
import { store } from "./state";
import { playerFooter } from "./player/playerFooter";

const copy = items;
Object.keys(copy).forEach((key) => {
  const item = items[key];
  if (item.type === "folder") {
    item.isCollapsedInGallery = true;
  }
});
store.setItems(items);

const scrollContainer = div(
  { className: cls.rowsContainer },
  div({}, fragment(store.getRootItems().map(myRow)))
);

const page = div(
  { className: cls.page },
  fragment([header(), scrollContainer, playerFooter()])
);
document.body.appendChild(page);

page.appendChild(minimap(scrollContainer));

css.class(cls.page, {
  height: "100vh",
  width: "100vw",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateAreas: `
    "header header header"
    "sidebar gallery rightSidebar"
    "player player player"`,
});

css.class(cls.rowsContainer, {
  gridArea: "gallery",
  position: "relative",
  overflowY: "overlay" as any,
  overflowX: "hidden",
  paddingTop: spacings.pageMarginTop,
  paddingBottom: 60,
  // marginLeft: "calc((100vw - 700px) / 2)",
  // maxWidth: `calc(700px + ((100vw - 700px) / 2) - ${spacings.bodyScrollWidth}px - 120px)`,
});

css.selector("*", {
  boxSizing: "border-box",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
});

css.selector(`.${cls.rowsContainer}::-webkit-scrollbar`, {
  width: 0,
});

css.selector(`.${cls.rowsContainer}::-webkit-scrollbar-thumb`, {
  // backgroundColor: colors.mediumPrimary,
  // borderTopLeftRadius: 4,
  // borderBottomLeftRadius: 4,
});
