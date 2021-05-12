import { dom, cls, style, cssVar, css } from "./browser";
import { colors } from "./designSystem";
import "./normalize";

type Events = {
  toggleTheme: Action<Event>;
};
class View {
  constructor(public events: Events) {}
  toggleThemeButton = dom.button({
    className: cls.themeButton,
    text: "",
    onClick: this.events.toggleTheme,
  });

  container = dom.div({
    className: "page",
    children: ["Hello", this.toggleThemeButton],
  });

  view = () => {
    return this.container;
  };

  setTheme = (theme: Theme) => {
    dom.assignClasses(this.container, {
      dark: theme === "dark",
      light: theme === "white",
    });
    this.toggleThemeButton.textContent = theme === "dark" ? "light" : "dark";
  };
}

class Controller {
  model: Model = {
    uiOptions: {
      theme: "dark",
    },
  };

  viewRef: View;
  constructor() {
    this.viewRef = new View({
      toggleTheme: this.toggleTheme,
    });
    this.viewRef.setTheme(this.model.uiOptions.theme);
  }

  toggleTheme = () => {
    this.model = {
      ...this.model,
      uiOptions: toggleTheme(this.model.uiOptions),
    };
    this.viewRef.setTheme(this.model.uiOptions.theme);
  };

  view = () => this.viewRef.view();
}

type Model = {
  uiOptions: UIOptions;
};

type Theme = "dark" | "white";
type UIOptions = {
  theme: Theme;
};

const toggleTheme = (ui: UIOptions): UIOptions => ({
  ...ui,
  theme: ui.theme == "dark" ? "white" : "dark",
});

const controller = new Controller();

document.body.appendChild(controller.view());

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
