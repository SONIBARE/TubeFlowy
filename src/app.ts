import { fragment } from "./infra";
import { renderRow } from "./row";

document.body.appendChild(
  fragment([
    renderRow("Foo"),
    renderRow("Bar"),
    renderRow("Fizz"),
    renderRow("Buzz"),
    renderRow("FizzBuzz"),
    renderRow("Buzzard"),
  ])
);
