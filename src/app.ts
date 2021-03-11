import { cls, css, div, fragment } from "./infra";
import { renderRow } from "./row";

document.body.appendChild(
  div(
    { className: cls.rowsContainer },
    fragment([
      renderRow("Foo"),
      renderRow("Bar"),
      renderRow("Fizz"),
      renderRow("Buzz"),
      renderRow("FizzBuzz"),
      renderRow("Buzzard"),
    ])
  )
);

css.class(cls.rowsContainer, {
  maxWidth: 700,
  margin: "0 auto",
});

css.selector("*", {
  boxSizing: "border-box",
});
