import Events from "./Events";

type UiState = {
  theme: Theme;
  isSearchVisible: boolean;
  tabFocused: TabName;
  mainFocus: string;
};

type UiStateEvents = {
  themeChanged: Theme;
  isSearchVisibleChanged: boolean;
  tabFocusedChanged: TabName;
  mainFocusChanged: string;
};

export class UiStateModel extends Events<UiStateEvents> {
  attributes: UiState = {
    theme: "dark",
    isSearchVisible: false,
    mainFocus: "HOME",
    tabFocused: "main",
  };

  get = <T extends keyof UiState>(key: T): UiState[T] => this.attributes[key];

  set = <T extends keyof UiState>(key: T, value: UiState[T]) => {
    this.attributes[key] = value;
    //@ts-expect-error need to figure out how to type Changed events based on generic
    this.trigger(`${key}Changed`, value);
  };

  toggleTheme = () => {
    const theme = this.get("theme");
    this.set("theme", theme == "dark" ? "white" : "dark");
  };

  toggleSearchVisibility = () =>
    this.set("isSearchVisible", !this.get("isSearchVisible"));
}
