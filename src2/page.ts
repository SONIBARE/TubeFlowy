import { store } from "./domain";
import { dom, ClassMap, style, css, cls } from "./infra";
import "./normalize";

const isEven = (n: number) => n % 2 == 0;
const isOdd = (n: number) => n % 2 != 0;

const getLabelForCounter = (n: number) =>
  n + ` (${isEven(n) ? "even" : "odd"})`;

export const viewCounter = () =>
  dom.button({
    id: "counter",
    className: cls.title,
    classMap: {
      even: dom.bindTo(store.onCounterChange, isEven),
      odd: dom.bindTo(store.onCounterChange, isOdd),
    },
    onClick: store.increment,
    text: dom.bindTo(store.onCounterChange, getLabelForCounter),
  });

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
