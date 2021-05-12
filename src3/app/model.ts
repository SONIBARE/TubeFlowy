export type Model = {
  uiOptions: UIOptions;
};

type UIOptions = {
  theme: Theme;
};

export const toggleTheme = (model: Model): Model => ({
  ...model,
  uiOptions: {
    ...model.uiOptions,
    theme: model.uiOptions.theme == "dark" ? "white" : "dark",
  },
});

export const initialModel: Model = {
  uiOptions: {
    theme: "dark",
  },
};
