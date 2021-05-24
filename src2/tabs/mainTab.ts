import { colors } from "../../src/infra";
import { store } from "../domain";
import { cls, css, dom, spacings, style } from "../infra";
import { viewChildren } from "./row";

export const mainTab = () =>
  dom.div({
    className: cls.mainTab,
    children: dom.bindToMap(store.onMainTabNodeFocusChange, (id) =>
      [title()].concat(viewChildren(id))
    ),
  });

const title = (): Node =>
  dom.div({
    classNames: [cls.title, css.classForLevel(0)],
    children: ["Home"],
  });

style.class(cls.mainTab, {
  flex: 1,
  height: "100%",
  overflow: "overlay",
});

css.createScrollStyles(cls.mainTab, {
  scrollbar: { width: 8 },
  thumb: {
    themes: {
      dark: { backgroundColor: "#313339" },
      light: { backgroundColor: colors.mediumPrimary },
    },
  },
});

style.class(cls.title, {
  fontSize: 36,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
