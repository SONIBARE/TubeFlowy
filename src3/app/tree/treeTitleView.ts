import { cls, dom, style } from "../../browser";
import { spacings, levels } from "../../designSystem";

export const renderTitle = (item: Item) =>
  dom.span({
    classNames: [cls.title, levels.classForLevel(0)],
    text: item.title,
  });

style.class(cls.title, {
  fontSize: 30,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
