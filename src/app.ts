import { appendHeader } from "./header";
import { cls, css, div, fragment, colors, button, spacings } from "./infra";
import { items } from "./playgrounds/slapstukLegacyItems";
import { myRow } from "./row";
import { appendSideScroll } from "./sideScroll";
import { store } from "./state";

store.setItems(items);

const container = div({}, fragment(store.getRootItems().map(myRow)));

appendHeader(document.body);
document.body.appendChild(div({ className: cls.rowsContainer }, container));
appendSideScroll(document.body);

css.class(cls.rowsContainer, {
  maxWidth: spacings.maxWidth,
  position: "relative",
  margin: "0 auto",
  paddingBottom: `calc(100vh - ${spacings.headerHeight}px - 60px)`,
});

css.selector("*", {
  boxSizing: "border-box",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
  paddingTop: spacings.headerHeight + spacings.pageMarginTop,
  overflowY: "overlay" as any,
});

css.selector("body::-webkit-scrollbar", {
  width: 8,
});

css.selector("body::-webkit-scrollbar-thumb", {
  backgroundColor: colors.scrollBar,
});
