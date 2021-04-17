import "@testing-library/jest-dom";
import { getByTestId } from "@testing-library/dom";
import { init, items } from "../domain";
import { cls, EventsHandler } from "../infra";
import ItemView from "./ItemView";
import { folder, deepCopy, createItemsFromArray } from "./testUtils";

describe("An empty folder", () => {
  const folder1 = folder("folder1");
  const folder2 = folder("folder2");
  const home = folder("home", [folder1.id, folder2.id]);
  let itemView: ItemView;
  let icon: HTMLElement;

  beforeEach(() => {
    init(new EventsHandler<MyEvents>());
    items.itemsLoaded(deepCopy(createItemsFromArray([home, folder1, folder2])));
    itemView = new ItemView(items.getItem(folder1.id), 0);
    const row = itemView.render().children[0] as HTMLElement;
    icon = getByTestId(row, itemIconId(folder1));
  });

  it("has a empty circle as icon", () => {
    expect(icon).toHaveClass(cls.focusCircleSvgEmpty);
  });

  describe("when dropping folder2 INSIDE folder1", () => {
    beforeEach(() => items.moveItemInside(folder2.id, folder1.id));

    it("makes the folder1 icons non empty", () => {
      expect(icon).not.toHaveClass(cls.focusCircleSvgEmpty);
    });
  });

  describe("when dropping folder2 AFTER folder1", () => {
    beforeEach(() => items.moveItemAfter(folder2.id, folder1.id));

    it("makes the folder1 icons empty again", () => {
      expect(icon).toHaveClass(cls.focusCircleSvgEmpty);
    });
  });
});

const itemIconId = (item: Item) => "itemIcon-" + item.id;
