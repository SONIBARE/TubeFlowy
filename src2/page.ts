import { dom, style, css, cls, spacings } from "./infra";
import { mainTab } from "./tabs/mainTab";
import { searchTab } from "./tabs/searchTab";
import "./normalize";
import { store } from "./domain";

export const viewPage = () =>
  dom.div({
    className: cls.pageContainer,
    classMap: dom.bindToMap(store.onThemeChange, (theme) => ({
      [cls.dark]: theme === "dark",
      [cls.light]: theme === "light",
    })),
    children: [
      themeButton(),
      dom.div({ className: cls.header }),
      dom.div({
        className: cls.main,
        children: [mainTab(), searchTab()],
      }),
      dom.div({ className: cls.footer }),
    ],
  });

const themeButton = () =>
  dom.button({
    className: cls.themeButton,
    onClick: store.toggleTheme,
    text: dom.bindToMap(store.onThemeChange, (theme) =>
      theme === "dark" ? "light" : "dark"
    ),
  });

style.class(cls.themeButton, {
  position: "absolute",
  top: spacings.headerHeight + 10,
  right: 10,
});

style.class(cls.pageContainer, {
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  ...css.flexColumn(),
});

style.class(cls.header, {
  minHeight: spacings.headerHeight,
  themes: {
    dark: { backgroundColor: "#1E1E24" },
    light: { backgroundColor: "lightGrey" },
  },
});

style.class(cls.footer, {
  minHeight: spacings.playerFooterHeight,
  themes: {
    dark: { backgroundColor: "#1E1E24" },
    light: { backgroundColor: "lightGrey" },
  },
});

style.class(cls.main, {
  flex: 1,
  ...css.flexRow(),
  overflow: "hidden",
  themes: {
    dark: { backgroundColor: "#15161E", color: "white" },
    light: { backgroundColor: "white", color: "black" },
  },
});

style.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
