import { dom, cls, style, cssVar, css } from "../browser";
import { colors } from "../designSystem";

type ViewEvents = {
  toggleTheme: EmptyAction;
};
export class View {
  constructor(public events: ViewEvents) {}
  toggleThemeButton = dom.button({
    className: cls.themeButton,
    text: "",
    onClick: this.events.toggleTheme,
  });

  container = dom.div({
    className: "page",
    children: ["Hi there 44", this.toggleThemeButton],
  });

  view = () => {
    return this.container;
  };

  setTheme = (theme: Theme) => {
    dom.assignClasses(this.container, {
      [cls.dark]: theme === "dark",
      [cls.light]: theme === "white",
    });
    this.toggleThemeButton.textContent = theme === "dark" ? "light" : "dark";
  };
}

style.class(cls.themeButton, {
  position: "absolute",
  top: 20,
  right: 20,
});

style.class("page", {
  height: "100vh",
  width: "100vw",
  transition: css.transition({ backgroundColor: 200, color: 200 }),
  backgroundColor: css.useVar(cssVar.mainBackground),
  color: css.useVar(cssVar.textMain),
});

style.class(cls.light, {
  variables: {
    "main-background": colors.light.bg,
    "text-main": colors.light.text,
  },
});

style.class(cls.dark, {
  variables: {
    "main-background": colors.dark.bg,
    "text-main": colors.dark.text,
  },
});
