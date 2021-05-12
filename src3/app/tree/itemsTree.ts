import { cls, dom, style } from "../../browser";
import { spacings, levels } from "../../designSystem";
import { viewChildren } from "./row";

export const renderTree = (
  container: Element,
  rootId: string,
  items: Items
) => {
  const item = items[rootId];
  container.appendChild(
    dom.span({
      classNames: [cls.title, levels.classForLevel(0)],
      text: item.title,
    })
  );

  if (item.type !== "YTvideo") {
    const children = viewChildren(rootId, items);
    children.forEach((child) => {
      container.appendChild(child);
    });
  }
};

style.class(cls.title, {
  fontSize: 36,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
