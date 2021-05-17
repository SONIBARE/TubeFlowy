import { ItemModel } from "../model/ItemModel";

let itemModels: ItemModel[] = [];
export const addRootItemModelToMemoryLeakDetector = (model: ItemModel) => {
  if (itemModels.length === 0) initShortcuts();
  itemModels.push(model);
};

const initShortcuts = () => {
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.code == "KeyV") {
      let modelsCount = 0;
      let callbacksCount = 0;
      let callbacksCountByEvents: Record<string, number> = {};

      const traverseModel = (model: ItemModel) => {
        modelsCount += 1;
        callbacksCount += Object.values(model.events).reduce(
          (count, arr) => count + arr.length,
          0
        );
        Object.entries(model.events).forEach(([key, value]) => {
          callbacksCountByEvents[key] =
            (callbacksCountByEvents[key] || 0) + value.length;
        });
        model.getChildren().forEach(traverseModel);
      };
      itemModels.forEach(traverseModel);
      console.log(
        `${modelsCount} models and in total ${callbacksCount} callbacks`
      );

      console.log(`Events: `, callbacksCountByEvents);
    }
  });
};
