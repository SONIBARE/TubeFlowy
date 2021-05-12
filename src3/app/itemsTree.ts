import { cls, dom, style } from "../browser";
import { spacings, levels } from "../designSystem";

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
    item.children.forEach((id) => {
      container.appendChild(viewRow(items[id]));
    });
  }
};

const viewRow = (item: Item) => dom.div({ children: [item.title] });

style.class(cls.title, {
  fontSize: 36,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
