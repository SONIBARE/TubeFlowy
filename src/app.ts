import { header } from "./header";
import { cls, css, div, fragment, colors, spacings } from "./infra";
import { items } from "./playgrounds/slapstukLegacyItems";
import { myRow } from "./row";
import { Minimap, minimap } from "./minimap";
import { store } from "./state";

store.setItems(items);

document.body.appendChild(
  fragment([
    header(),
    div(
      { className: cls.rowsContainer },
      div({}, fragment(store.getRootItems().map(myRow)))
    ),
    minimap(),
  ])
);

css.class(cls.rowsContainer, {
  position: "relative",
  marginLeft: "calc((100vw - 700px) / 2)",
  maxWidth: `calc(700px + ((100vw - 700px) / 2) - ${spacings.bodyScrollWidth}px - 120px)`,
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
