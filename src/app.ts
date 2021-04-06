import { header } from "./header";
import { cls, colors, css, div, fragment, spacings } from "./infra";
import { items } from "./domain";
import { playerFooter } from "./player/playerFooter";
import * as database from "./api/loginService";
import { leftNavigationSidebar } from "./sidebar/leftSidebar";
import { searchResults } from "./searchResults/searchPage";
import * as stateLoader from "./api/stateLoader";

database.initFirebase(() => undefined);

stateLoader.loadRemoteState();

//TODO: refactor this, show loader and render without need for home item
items.itemsLoaded({
  HOME: {
    type: "folder",
    children: [],
    id: "HOME",
    title: "Home",
  },
});

const scrollContainer = div({ className: cls.rowsScrollContainer });
const container = div({ className: cls.rowsContainer }, scrollContainer);

const page = div(
  { className: cls.page },
  fragment([
    header(),
    container,
    searchResults(),
    leftNavigationSidebar(),
    playerFooter(),
  ])
);

document.body.appendChild(page);

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

css.class(cls.pageTitle, {
  fontSize: 23,
  marginLeft: 22,
  marginBottom: 5,
  marginTop: 10,
  fontWeight: "bold",
  outline: "none",
});

css.class(cls.rowsContainer, {
  gridArea: "gallery",
  overflowX: "hidden",
  overflowY: "overlay" as any,

  paddingLeft: spacings.rowsContainerLeftPadding,
});

css.class(cls.rowsScrollContainer, {
  //used to position rowHighlight
  position: "relative",
  paddingBottom: 60,
  paddingTop: spacings.pageMarginTop,
  maxWidth: 700,
  margin: "0 auto",
});

css.selector("*", {
  boxSizing: "border-box",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
});

css.selector(`.${cls.rowsContainer}::-webkit-scrollbar`, {
  width: 8,
});

css.selector(`.${cls.rowsContainer}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});
