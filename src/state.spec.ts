import { store } from "./state";
import { createItemsFromArray, folder, video } from "./testUtils";

const v1 = video("v1", "videoId1");
const v2 = video("v1", "videoId1");
const home = folder("HOME", [v1.id, v2.id]);

describe("having a store with two items", () => {
  beforeEach(() => {
    store.itemsLoaded(createItemsFromArray([v1, v2, home]));
  });
  describe("when I click play first item", () => {
    let onPlay: jest.Mock;
    beforeEach(() => {
      onPlay = jest.fn();
      store.addEventListener("item-play", onPlay);
      store.play("v1");
    });

    it("event item-play should be triggered", () => {
      expect(onPlay).toHaveBeenCalledWith(v1);
    });

    it("no item-unplay should be triggered", () => {});

    describe("when I click play 2 when first is being played", () => {
      it("event item-play should be triggered", () => {});

      it("no item-unplay should be triggered", () => {});
    });
  });
});
