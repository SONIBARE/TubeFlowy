import { header } from "./header";
import { cls, css, div, fragment, spacings } from "./infra";
import { myRow } from "./row";
import { minimap } from "./minimap";
import { store } from "./state";
import { playerFooter } from "./player/playerFooter";
import * as database from "./api/loginService";
import { focusItem } from "./focuser";

database.initFirebase(() => undefined);
database.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((data) => {
  const items: Items = JSON.parse(data.itemsSerialized);
  store.setItems(items);

  focusItem(items[data.selectedItemId]);
});

store.setItems({
  HOME: {
    type: "folder",
    children: [],
    id: "HOME",
    title: "Home",
  },
});

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
