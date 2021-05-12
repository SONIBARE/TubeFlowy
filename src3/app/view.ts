import { dom, cls, style, cssVar, css } from "../browser";
import { colors } from "../designSystem";

type ViewEvents = {
  toggleTheme: EmptyAction;
};
export class View {
  private header = dom.div({ className: cls.header });
  private footer = dom.div({ className: cls.footer });
  private mainTab = dom.div({ className: cls.mainTab });
  private searchTab = dom.div({
    classNames: [cls.searchTab, cls.searchTabHidden],
  });

  constructor(public events: ViewEvents) {}
  private toggleThemeButton = dom.button({
    className: cls.themeButton,
    text: "",
    onClick: this.events.toggleTheme,
  });

  private container = dom.div({
    className: "page",
    children: [
      this.header,
      dom.div({
        className: cls.main,
        children: [this.mainTab, this.searchTab],
      }),
      this.footer,
      this.toggleThemeButton,
    ],
  });

  public view = () => {
    return this.container;
  };

  public setTheme = (theme: Theme) => {
    dom.assignClasses(this.container, {
      [cls.dark]: theme === "dark",
      [cls.light]: theme === "white",
    });
    this.toggleThemeButton.textContent = theme === "dark" ? "light" : "dark";
  };

  public setSearchVisilibity = (isVisible: boolean) =>
    dom.assignClasses(this.searchTab, {
      [cls.searchTabHidden]: !isVisible,
    });

  public setTabFocused = (tabName: TabName) => {
    console.warn("setTabFocused is not implemented");
  };
}

style.class(cls.themeButton, {
  position: "fixed",
  bottom: 20,
  right: 20,
});

style.class(cls.page, {
  height: "100vh",
  width: "100vw",
  transition: css.transition({ backgroundColor: 200, color: 200 }),
  backgroundColor: css.useVar(cssVar.mainBackground),
  color: css.useVar(cssVar.textMain),
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

style.class(cls.main, {
  flex: 1,
  display: "flex",
  flexDirection: "row",
});
style.class(cls.header, {
  height: 48,
  transition: css.transition({ backgroundColor: 200 }),
  backgroundColor: css.useVar(cssVar.menuColor),
});

style.class(cls.footer, {
  height: 48,
  transition: css.transition({ backgroundColor: 200 }),
  backgroundColor: css.useVar(cssVar.menuColor),
});
style.class(cls.mainTab, {
  flex: 1,
});

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: 200 }),
});
style.class(cls.searchTabHidden, { marginRight: "-100%" });

style.class(cls.light, {
  variables: {
    "main-background": colors.light.bg,
    "text-main": colors.light.text,
    "menu-color": colors.light.menu,
  },
});

style.class(cls.dark, {
  variables: {
    "main-background": colors.dark.bg,
    "text-main": colors.dark.text,
    "menu-color": colors.dark.menu,
  },
});
