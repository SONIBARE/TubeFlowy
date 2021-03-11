import { cls, css, fragment, svg, circle } from "./infra";
import { chevron } from "./infra/icons";

class MyRow extends HTMLElement {
  outerRadius = 10;
  innerRadius = 5;
  myCircle = () =>
    svg(
      {
        className: cls.svgContainer,
        viewBox: `0 0 ${this.outerRadius * 2} ${this.outerRadius * 2}`,
        style: {
          width: this.outerRadius * 2,
          height: this.outerRadius * 2,
          fill: "#4C5155",
        },
      },
      circle({
        className: cls.outerCircle,
        cx: this.outerRadius,
        cy: this.outerRadius,
        r: this.outerRadius,
        fill: "#B8BCBF",
      }),
      circle({
        cx: this.outerRadius,
        cy: this.outerRadius,
        r: this.innerRadius,
        fill: "#4C5155",
      })
    );
  isOpen = false;

  render(title: string) {
    const children = [chevron(cls.chevron), this.myCircle(), title];
    this.appendChild(fragment(children));
  }

  static create(title: string) {
    const row1 = document.createElement("tubeflowy-row") as MyRow;
    row1.render(title);
    return row1;
  }
}
export const renderRow = MyRow.create;

customElements.define("tubeflowy-row", MyRow);

css.tag("tubeflowy-row" as any, {
  margin: "6px auto",
  maxWidth: 700,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontWeight: 500,
  color: "rgb(42, 49, 53)",
});

css.class(cls.outerCircle, {
  opacity: 0,
});
css.class(cls.chevron, {
  height: 14,
  width: 14,
});

css.parentHover(cls.svgContainer, cls.outerCircle, {
  opacity: 1,
});

css.class(cls.svgContainer, {
  marginRight: 2,
  cursor: "pointer",
});

css.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  margin: 0,
  paddingTop: 20,
});
