import { cls, css, fragment, svg, circle, div } from "./infra";
import { chevron } from "./infra/icons";
import { store } from "./state";

class MyRow extends HTMLElement {
  outerRadius = 10;
  innerRadius = 4.5;
  chevron!: SVGSVGElement;
  //TODO: move this to a model
  childContainer: HTMLElement | undefined;
  item: Item | undefined;

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

  onItemToggled = (item: Item) => {
    if (item.type == "folder") {
      if (item.isCollapsedInGallery) {
        this.chevron.classList.add(cls.chevronOpen);
        this.childContainer = div(
          { className: cls.childContainer },
          fragment(store.getChildrenFor(item.id).map(renderRow))
        );
        this.appendChild(this.childContainer);
      } else {
        this.chevron.classList.remove(cls.chevronOpen);
        if (this.childContainer) {
          this.childContainer.remove();
          this.childContainer = undefined;
        }
      }
    }
  };

  render(item: Item) {
    this.item = item;
    this.chevron = chevron(cls.chevron);
    this.chevron.addEventListener("click", () =>
      store.toggleFolderVisibility(item.id)
    );

    this.appendChild(
      div({ className: cls.row }, this.chevron, this.myCircle(), item.title)
    );

    store.addEventListener("itemChanged." + this.item.id, this.onItemToggled);
    this.onItemToggled(item);
  }

  disconnectedCallback() {
    if (this.item)
      store.removeEventListener(
        "itemChanged." + this.item.id,
        this.onItemToggled
      );
  }

  static create(item: Item) {
    const row1 = document.createElement("tubeflowy-row") as MyRow;
    row1.render(item);
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
