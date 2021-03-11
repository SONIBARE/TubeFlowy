import { cls, css, fragment, svg, circle, div } from "./infra";
import { chevron } from "./infra/icons";

class MyRow extends HTMLElement {
  outerRadius = 10;
  innerRadius = 4.5;
  chevron!: SVGSVGElement;
  //TODO: move this to a model
  childContainer: HTMLElement | undefined;
  isOpen = false;

  myCircle = () =>
    svg(
      {
        className: cls.svgContainer,
        viewBox: `0 0 ${this.outerRadius * 2} ${this.outerRadius * 2}`,
        style: {
          width: this.outerRadius * 2,
          height: this.outerRadius * 2,
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

  onChevronClick = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chevron.classList.add(cls.chevronOpen);
      this.childContainer = div(
        { className: cls.childContainer },
        renderRow("Child")
      );
      this.appendChild(this.childContainer);
    } else {
      this.chevron.classList.remove(cls.chevronOpen);
      if (this.childContainer) {
        this.childContainer.remove();
        this.childContainer = undefined;
      }
    }
  };

  render(title: string) {
    this.chevron = chevron(cls.chevron);
    this.chevron.addEventListener("click", this.onChevronClick);
    const children = [this.chevron, this.myCircle(), title];
    this.appendChild(div({ className: cls.row }, fragment(children)));
  }

  static create(title: string) {
    const row1 = document.createElement("tubeflowy-row") as MyRow;
    row1.render(title);
    return row1;
  }
}
export const renderRow = MyRow.create;

customElements.define("tubeflowy-row", MyRow);

css.class(cls.row, {
  marginLeft: -1000,
  paddingLeft: 1010,
  paddingTop: 4,
  paddingBottom: 4,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontWeight: 500,
  color: "rgb(42, 49, 53)",
});

css.class(cls.childContainer, {
  marginLeft: 33,
  borderLeft: "1px solid #ECEEF0",
});

css.class(cls.outerCircle, {
  opacity: 0,
});

css.parentHover(cls.row, cls.chevron, {
  opacity: 1,
});

css.class(cls.chevron, {
  height: 14,
  width: 14,
  opacity: 0,
  transition: "transform 200ms, opacity 100ms",
  cursor: "pointer",
  color: "#B8BCBF",
});
css.hover(cls.chevron, {
  color: "rgb(42, 49, 53)",
});

css.class(cls.chevronOpen, {
  transform: "rotateZ(90deg)",
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
