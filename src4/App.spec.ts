import App from "./App";
import { fireEvent, getAllByTestId, getByTestId } from "@testing-library/dom";

it("App by default should have Hello There text", () => {
  const ap = new App();

  document.body.appendChild(ap.el);
  expect(getRowsTitles()).toEqual([
    "Sample text",
    "Sample test second",
    "Sample text third",
  ]);

  fireEvent.click(removeButtonForRow("Sample test second"));

  expect(getRowsTitles()).toEqual(["Sample text", "Sample text third"]);

  fireEvent.click(removeButtonForRow("Sample text third"));
  expect(getRowsTitles()).toEqual(["Sample text"]);

  fireEvent.click(addNewRowButton());
  expect(getRowsTitles()).toEqual(["Sample text", "New Item"]);

  fireEvent.click(removeButtonForRow("New Item"));
  expect(getRowsTitles()).toEqual(["Sample text"]);
});

const getRowsTitles = () =>
  getAllByTestId(document.body, "item-row").map(getRowTitle);

const getRowTitleElement = (row: HTMLElement) => getByTestId(row, "title");
const getRowTitle = (row: HTMLElement) => getRowTitleElement(row).textContent;
const getRowRemoveButton = (row: HTMLElement) => getByTestId(row, "remove");

const removeButtonForRow = (rowId: string) =>
  getRowRemoveButton(
    getAllByTestId(document.body, "item-row").find(
      (row) => getRowTitle(row) === rowId
    )!
  );

const addNewRowButton = () => getByTestId(document.body, "addNew");
