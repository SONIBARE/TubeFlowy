import { cls, dom, style } from "../../../browser";
import { levels, spacings } from "../../../designSystem";

export default class TreeTitleView {
  el: Element;

  constructor(title: string) {
    this.el = dom.span({
      classNames: [cls.title, levels.classForLevel(0)],
      text: title,
    });
  }

  updateTitle = (title: string) => (this.el.textContent = title);
}

style.class(cls.title, {
  fontSize: 30,
  fontWeight: "bold",
  marginTop: 20,
  marginLeft: spacings.chevronSize + 2,
});
