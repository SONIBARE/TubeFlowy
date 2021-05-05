import { fireEvent } from "@testing-library/dom";
import { dom } from "../src/infra";
import { store } from "./domain";
import { cls } from "./infra";
import { viewCounter } from "./page";

it("sub specs", () => {
  dom.setChildren(document.body, viewCounter());

  const elem = document.getElementById("counter")!;
  expect(elem.textContent).toEqual("0 (even)");
  expect(elem).toHaveClass(cls.even);
  expect(elem).not.toHaveClass(cls.odd);

  fireEvent.click(elem);
  expect(elem.textContent).toEqual("1 (odd)");
  expect(elem).toHaveClass(cls.odd);
  expect(elem).not.toHaveClass(cls.even);

  store.increment();
  expect(elem.textContent).toBe("2 (even)");
  expect(elem).toHaveClass(cls.even);
  expect(elem).not.toHaveClass(cls.odd);
  //this line should unsubscribe element from event handlers vie Custom Elements
  document.body.innerHTML = ``;

  expect(elem.textContent).toBe("2 (even)");
  store.increment();
  expect(elem.textContent).toBe("2 (even)");
  expect(elem).toHaveClass(cls.even);
  expect(elem).not.toHaveClass(cls.odd);
});
