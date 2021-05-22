import { UiStateModel } from "../model/UserSettingsModel";

export let uiModel = new UiStateModel();

export const resetModels = () => {
  uiModel = new UiStateModel();
};
