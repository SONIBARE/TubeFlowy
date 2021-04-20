import { dom } from "../infra";
import { getByTestId } from "@testing-library/dom";

it("sample", () => {
  dom.setChildren(document.body, dom.div({ testId: "sample" }, "Hey"));
  expect(get("sample")).toBeInTheDocument();
  expect(get("sample").textContent).toBe("Hey");
});

const get = (testId: string) => getByTestId(document.body, testId);
