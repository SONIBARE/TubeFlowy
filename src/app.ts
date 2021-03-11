import { cls, css, div, fragment } from "./infra";
import {
  convertLegacyItems,
  legacyItems,
} from "./playgrounds/slapstukLegacyItems";
import { renderRow } from "./row";
import { store } from "./state";

store.setItems(convertLegacyItems(legacyItems));

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
