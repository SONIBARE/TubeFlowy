import { store } from "./domain";
import { dom, style, css, cls } from "./infra";
import "./normalize";

const getLabelForCounter = (s: number) =>
  s + ` (${s % 2 == 0 ? "even" : "odd"})`;

export const viewCounter = () => {
  const elem = dom.button({
    id: "counter",
    className: cls.title,
    onClick: store.increment,
    text: dom.bindTo(store.onCounterChange, getLabelForCounter),
  });

  return elem;
};

style.class(cls.title, {
  margin: css.margin(60, 20),
  fontSize: 60,
});

style.class(cls.odd, {
  color: "red",
});

style.class(cls.even, {
  color: "blue",
});
