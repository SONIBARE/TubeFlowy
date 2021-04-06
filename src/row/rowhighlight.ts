import { cls, css, dom, spacings } from "../infra";

class RowHighlighter extends HTMLElement {
  render() {
    this.classList.add(cls.rowHighlight);
  }
  placeOver = (elem: HTMLElement) => {
    this.style.top = elem.offsetTop - spacings.rowVecticalPadding + "px";
    this.style.height =
      elem.offsetHeight + spacings.rowVecticalPadding * 2 + "px";
  };
}

customElements.define("slp-row-highlighter", RowHighlighter);
let highlighter: RowHighlighter | undefined;
export const viewHighlighter = () => {
  highlighter = document.createElement("slp-row-highlighter") as RowHighlighter;
  highlighter.render();
  return highlighter;
};

export const placeOver = (elem: HTMLElement) => {
  if (highlighter) highlighter.placeOver(elem);
};

css.class(cls.rowHighlight, {
  position: "absolute",
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.08)",
  pointerEvents: "none",
  ...css.transition({ top: 100, height: 100 }),
});
