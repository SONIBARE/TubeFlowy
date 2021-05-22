import Model from "./base/Model";

type UiState = {
  theme: Theme;
  isSearchVisible: boolean;
  tabFocused: TabName;
  mainFocus: string;
};

export class UiStateModel extends Model<UiState> {
  constructor() {
    super({
      theme: "dark",
      isSearchVisible: false,
      mainFocus: "HOME",
      tabFocused: "main",
    });
  }

  toggleTheme = () => {
    const theme = this.get("theme");
    this.set("theme", theme == "dark" ? "white" : "dark");
  };

  toggleSearchVisibility = () =>
    this.set("isSearchVisible", !this.get("isSearchVisible"));
}
