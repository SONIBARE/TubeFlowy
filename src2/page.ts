import { dom, style, css, cls } from "./infra";
import { mainTab } from "./tabs/mainTab";
import { searchTab } from "./tabs/searchTab";
import "./normalize";

export const viewPage = () =>
  dom.div({
    className: cls.pageContainer,
    children: [
      dom.div({ className: cls.header }),
      dom.div({
        className: cls.main,
        children: [mainTab(), searchTab()],
      }),
      dom.div({ className: cls.footer }),
    ],
  });

style.class(cls.pageContainer, {
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  ...css.flexColumn(),
});

style.class(cls.header, {
  height: 60,
  backgroundColor: "lightGrey",
});

style.class(cls.footer, {
  height: 60,
  backgroundColor: "lightGrey",
});

style.class(cls.main, {
  flex: 1,
  ...css.flexRow(),
});

style.selector("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});
