import { store } from "./domain";
import { dom, style, css, cls } from "./infra";
import "./normalize";

export const viewCounter = () =>
  dom.div({
    className: cls.pageContainer,
    children: [
      dom.div({ className: cls.header }),
      dom.div({
        className: cls.main,
        children: [
          dom.div({ className: cls.mainTab, children: ["main"] }),
          dom.div({
            className: cls.searchTab,
            classMap: {
              [cls.searchTabHidden]: dom.bindTo(store.onSearchVisibilityChange),
            },
            children: ["search"],
          }),
        ],
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

style.class(cls.mainTab, {
  flex: 1,
});

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: 200 }),
});

style.class(cls.searchTabHidden, {
  marginRight: "-100%",
});
