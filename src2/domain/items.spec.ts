import { buildItems } from "../tests/testDataBuilder";
import Store from "./store";

it("toggling item1 visibility", () => {
  const store = new Store();

  store.setItems(
    buildItems(`
  Home
    sub1
    sub2
  `)
  );
  const sub1Collapse = jest.fn();
  const sub2Collapse = jest.fn();
  store.itemCollapse.bind("sub1", sub1Collapse);
  store.itemCollapse.bind("sub2", sub2Collapse);
  expect(sub1Collapse).lastCalledWith(false);
  expect(sub2Collapse).lastCalledWith(false);
  store.toggleIsItemCollapse("sub1");
  expect(sub1Collapse).lastCalledWith(true);
  expect(sub2Collapse).lastCalledWith(false);
});
