import { store } from "./domain";
import { dom, style, css, cls } from "./infra";

import "./normalize";

const button = () =>
  dom.button(
    {
      className: cls.title,
      onClick: store.increment,
    },
    dom.bind(store.onIncrement, (s) => s + 1 + "!")
  );

document.body.appendChild(button());

style.class(cls.title, {
  margin: css.margin(60, 20),
  color: "red",
  fontSize: 60,
});
