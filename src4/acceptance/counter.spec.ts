import { fireEvent, getByTestId } from "@testing-library/dom";
import App from "../app/App";

it("counter", () => {
  document.body.appendChild(new App().el);
  expect(counterText()).toEqual("0");

  fireEvent.click(counter());
  expect(counterText()).toEqual("1");
});

const counter = () => getByTestId(document.body, "counter");
const counterText = () => counter().textContent;
