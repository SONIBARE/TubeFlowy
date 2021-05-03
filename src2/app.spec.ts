import { fireEvent } from "@testing-library/dom";
import Store from "./domain/store";
import { dom } from "./infra";

const toString = (s: {}) => s + "";

it("sub specs", () => {
  const store = new Store();
  const button = () =>
    dom.button(
      { onClick: store.increment },
      dom.bind(store.onIncrement, toString)
    );

  document.body.innerHTML = ``;
  const elem = button();

  document.body.appendChild(elem);

  expect(elem.textContent).toEqual("0");
  fireEvent.click(elem);
  expect(elem.textContent).toEqual("1");
});
