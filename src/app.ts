import { focusItem } from "./focuser";
import { cls, css, div, fragment, colors, button } from "./infra";
import { items } from "./playgrounds/slapstukLegacyItems";
import { myRow } from "./row";
import { store } from "./state";

store.setItems(items);

const container = div({}, fragment(store.getRootItems().map(myRow)));

document.body.appendChild(div({ className: cls.rowsContainer }, container));

document.body.appendChild(
  button({
    text: "<",
    className: cls.backButton,
    onClick: () => focusItem(store.getRoot()),
  })
);

css.class(cls.rowsContainer, {
  maxWidth: 700,
  position: "relative",
  margin: "0 auto",
});

css.class(cls.backButton, {
  position: "fixed",
  top: 20,
  left: 20,
});

css.selector("*", {
  boxSizing: "border-box",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
  paddingTop: 20,
  overflowY: "scroll" as any,
});

css.selector("body::-webkit-scrollbar", {
  width: 8,
});

css.selector("body::-webkit-scrollbar-thumb", {
  backgroundColor: colors.scrollBar,
});
