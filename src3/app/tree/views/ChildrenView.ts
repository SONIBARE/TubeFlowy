import { cls, css, cssVar, dom, style } from "../../../browser";
import { levels, timings } from "../../../designSystem";

export default class ChildrenView {
  el = dom.div({ className: cls.rowChildren });
  constructor(private level: number) {}

  render = (elements: Node[]) => {
    elements.forEach((c) => this.el.appendChild(c));
    this.el.appendChild(
      dom.div({
        classNames: [
          cls.rowChildrenBorder,
          levels.childrenForLevel(this.level),
        ],
      })
    );
  };

  hide = () => {
    this.el.remove();
    this.el.innerHTML = ``;
  };
}

style.class(cls.rowChildren, {
  position: "relative",
});

style.class(cls.rowChildrenBorder, {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: css.useVar(cssVar.ambient),
  transition: css.transition({ backgroundColor: timings.themeSwitchDuration }),
});
