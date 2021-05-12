export type Model = {
  items: Items;
  uiOptions: UIOptions;
};

type UIOptions = {
  theme: Theme;
  isSearchVisible: boolean;
  tabFocused: TabName;
};

export const toggleTheme = (model: Model): Model => ({
  ...model,
  uiOptions: {
    ...model.uiOptions,
    theme: model.uiOptions.theme == "dark" ? "white" : "dark",
  },
});

export const initialModel: Model = {
  items: {},
  uiOptions: {
    theme: "dark",
    isSearchVisible: false,
    tabFocused: "main",
  },
};

export const toggleSearchVisibility = (model: Model): Model => {
  if (model.uiOptions.isSearchVisible) {
    return {
      ...model,
      uiOptions: {
        ...model.uiOptions,
        tabFocused: "main",
        isSearchVisible: false,
      },
    };
  } else
    return {
      ...model,
      uiOptions: {
        ...model.uiOptions,
        tabFocused: "search",
        isSearchVisible: true,
      },
    };
};

export const setItems = (model: Model, items: Items): Model => ({
  ...model,
  items,
});
