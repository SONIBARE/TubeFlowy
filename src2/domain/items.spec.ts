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
  const sub1Open = jest.fn();
  const sub2Open = jest.fn();
  store.itemOpen.bind("sub1", sub1Open);
  store.itemOpen.bind("sub2", sub2Open);
  expect(sub1Open).lastCalledWith(true);
  expect(sub2Open).lastCalledWith(true);
  store.toggleIsItemCollapse("sub1");
  expect(sub1Open).lastCalledWith(false);
  expect(sub2Open).lastCalledWith(true);
});
