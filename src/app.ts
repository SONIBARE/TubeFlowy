import { cls, css, div, fragment, colors } from "./infra";
import { items } from "./playgrounds/slapstukLegacyItems";
import { renderRow } from "./row";
import { store } from "./state";

store.setItems(items);

document.body.appendChild(
  div(
    { className: cls.rowsContainer },
    fragment(store.getRootItems().map(renderRow))
  )
);

css.class(cls.rowsContainer, {
  maxWidth: 700,
  margin: "0 auto",
});

css.selector("*", {
  boxSizing: "border-box",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
  paddingTop: 20,
  overflowY: "overlay" as any,
});

css.selector("body::-webkit-scrollbar", {
  width: 8,
});

css.selector("body::-webkit-scrollbar-thumb", {
  backgroundColor: colors.scrollBar,
});
