import { colors } from "../../src/infra";
import { cls, css, dom, spacings, style } from "../infra";
import { viewChildren } from "./row";

export const mainTab = () =>
  dom.div({
    className: cls.mainTab,
    children: [title()].concat(viewChildren("HOME")),
  });

const title = () =>
  dom.div({
    classNames: [cls.title, css.classForLevel(0)],
    children: ["Title"],
  });

style.class(cls.mainTab, {
  flex: 1,
});

style.class(cls.title, {
  fontSize: 36,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
