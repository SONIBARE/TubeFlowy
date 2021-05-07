import { store } from "../domain";
import { cls, css, dom, style } from "../infra";

export const searchTab = () =>
  dom.div({
    className: cls.searchTab,
    classMap: {
      [cls.searchTabHidden]: dom.bindTo(store.onSearchVisibilityChange),
    },
    children: ["search"],
  });

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: 200 }),
});

style.class(cls.searchTabHidden, {
  marginRight: "-100%",
});
