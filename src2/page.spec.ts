import { fireEvent } from "@testing-library/dom";
import { dom } from "../src/infra";
import { store } from "./domain";
import { viewCounter } from "./page";

it("sub specs", () => {
  dom.setChildren(document.body, viewCounter());

  const elem = document.getElementById("counter")!;
  expect(elem.textContent).toEqual("0 (even)");
  fireEvent.click(elem);
  expect(elem.textContent).toEqual("1 (odd)");

  store.increment();
  expect(elem.textContent).toBe("2 (even)");

  //this line shoudl unsubscribe element from counting
  document.body.innerHTML = ``;

  expect(elem.textContent).toBe("2 (even)");
  store.increment();
  expect(elem.textContent).toBe("2 (even)");
});
