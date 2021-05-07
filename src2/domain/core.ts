//UI config
export type TabName = "main" | "search";

export const initialUiState = {
  isSearchVisible: false,
  tabFocused: "main" as TabName,
};

export type UIState = typeof initialUiState;

export const toggleSEarchVisibility = (uiState: UIState): UIState => {
  if (uiState.isSearchVisible) {
    return {
      ...uiState,
      tabFocused: "main",
      isSearchVisible: false,
    };
  } else
    return {
      ...uiState,
      tabFocused: "search",
      isSearchVisible: true,
    };
};

export const focusOnMain = (state: UIState): UIState => ({
  ...state,
  tabFocused: "main",
});
