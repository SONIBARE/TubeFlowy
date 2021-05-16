import { dom, cls, style, cssVar, css } from "../browser";
import { spacings, timings, getThemeClassMap } from "../designSystem";

type ViewEvents = {
  toggleTheme: EmptyAction;
};
export class AppView {
  header = dom.div({ className: cls.header });
  footer = dom.div({ className: cls.footer });
  mainTab = dom.div({ className: cls.mainTab });
  searchTab = dom.div({
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

  get el() {
    return this.container;
  }

  public setTheme = (theme: Theme) => {
    dom.assignClassMap(this.container, getThemeClassMap(theme));
    this.toggleThemeButton.textContent = theme === "dark" ? "light" : "dark";
  };

  public setSearchVisilibity = (isVisible: boolean) =>
    dom.assignClassMap(this.searchTab, {
      [cls.searchTabHidden]: !isVisible,
    });

  public setTabFocused = (tabName: TabName) => {
    console.warn("setTabFocused is not implemented");
  };
}

style.class(cls.themeButton, {
  position: "fixed",
  bottom: spacings.playerFooterHeight + 20,
  right: 20,
});

style.class(cls.page, {
  height: "100vh",
  width: "100vw",
  transition: css.transition({
    backgroundColor: timings.themeSwitchDuration,
    color: timings.themeSwitchDuration,
  }),
  backgroundColor: css.useVar(cssVar.mainBackground),
  color: css.useVar(cssVar.textMain),
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

style.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

style.class(cls.main, {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});
style.class(cls.header, {
  position: "relative",
  height: spacings.headerHeight,
  transition: css.transition({ backgroundColor: timings.themeSwitchDuration }),
  backgroundColor: css.useVar(cssVar.mainBackground),
});

style.after(cls.header, {
  position: "absolute",
  left: 0,
  right: 0,
  top: "100%",
  height: 4,
  content: `" "`,
  background: `linear-gradient( rgba(9, 30, 66, 0.13) 0px, rgba(9, 30, 66, 0.13) 1px, rgba(9, 30, 66, 0.08) 1px, rgba(9, 30, 66, 0) 4px)`,
});

style.class(cls.mainTab, {
  flex: 1,
  overflowY: "overlay",
  overflowX: "hidden",
});

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: timings.searchHideDuration }),
  backgroundColor: "green",
});
style.class(cls.searchTabHidden, { marginRight: "-100%" });

css.createScrollStyles(cls.mainTab, {
  scrollbar: { width: 8 },
  thumb: {
    backgroundColor: css.useVar(cssVar.ambient),
  },
});
