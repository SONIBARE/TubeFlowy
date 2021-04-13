import * as items from "./items";
import { createItemsFromArray, folder, video } from "./testUtils";

//HOME
// f1
//   v1.1
//   v1.2
// v3
describe("Having a folder and a bunch of videos", () => {
  beforeEach(() => {
    const v11 = video("v1.1", "videoId1");
    const v12 = video("v1.2", "videoId1");
    const f1 = folder("f1", [v11.id, v12.id]);
    const v3 = video("v3", "videoId3");
    const home = folder("HOME", [f1.id, v3.id]);
    items.itemsLoaded(createItemsFromArray([v11, v12, v3, f1, home]));
  });

  it("moving v3 after v1.1 should place v3 after v1.1", () => {
    items.moveItemAfter("v3", "v1.1");
    items.getChildrenFor("f1");
    expect(items.getChildrenFor("f1").map((i) => i.id)).toEqual([
      "v1.1",
      "v3",
      "v1.2",
    ]);
    expect(items.getChildrenFor("HOME").map((i) => i.id)).toEqual(["f1"]);
  });

  it("moving v3 after v1.1 should place v3 after v1.1", () => {
    items.moveItemBefore("v3", "v1.1");
    items.getChildrenFor("f1");
    expect(items.getChildrenFor("f1").map((i) => i.id)).toEqual([
      "v3",
      "v1.1",
      "v1.2",
    ]);
    expect(items.getChildrenFor("HOME").map((i) => i.id)).toEqual(["f1"]);
  });
  it("moving v3 after v1.1 should place v3 after v1.1", () => {
    items.moveItemInside("v3", "f1");
    items.getChildrenFor("f1");
    expect(items.getChildrenFor("f1").map((i) => i.id)).toEqual([
      "v3",
      "v1.1",
      "v1.2",
    ]);
    expect(items.getChildrenFor("HOME").map((i) => i.id)).toEqual(["f1"]);
  });
});
