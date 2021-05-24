import { ClassName, cls, style } from "../infra";

export const colors = {
  // superLight: "rgba(0,0,0,0.03)",
  // lightPrimary: "#DCE0E2",
  mediumPrimary: "#B8BCBF",
  // darkPrimary: "#4C5155",
  // buttonHover: "#ECEEF0",
  // border: "#ECEEF0",
  // scrollBar: "rgb(42, 49, 53)",
};
const darkTheme = {
  //Accent colors is for primary stuff
  accent: "white",

  //Half-accent used for small items which are very faded when in ambient
  halfAccent: "#B8BCBF",
  //Ambient is used for border, outer circle, icons like chevron, anything you non-accent
  ambient: "#4C5155",
  shadowColor: "rgba(255,255,255,0.5)",
  text: "white",
  bg: "#15161E",
  bhHover: "#1E1E24",
  menu: "#1E1E24",
};

const lightTheme: typeof darkTheme = {
  accent: "rgb(76, 81, 85)",
  halfAccent: "#B8BCBF",
  ambient: "#DCE0E2",
  shadowColor: "rgba(0,0,0,0.5)",
  text: "black",
  bhHover: "rgba(0,0,0,0.03)",
  bg: "white",
  menu: "lightGrey",
};

const assignColorVariables = (
  className: ClassName,
  theme: typeof darkTheme
) => {
  style.class(className, {
    variables: {
      "main-background": theme.bg,
      "text-main": theme.text,
      "menu-color": theme.menu,
      ambient: theme.ambient,
      accent: theme.accent,
      "bg-hover": theme.bhHover,
      "half-accent": theme.halfAccent,
      "shadow-main": theme.shadowColor,
    },
  });
};

export const getThemeClassMap = (theme: Theme) => ({
  [cls.dark]: theme === "dark",
  [cls.light]: theme === "white",
});

export const initThemes = () => {
  assignColorVariables(cls.dark, darkTheme);
  assignColorVariables(cls.light, lightTheme);
};
