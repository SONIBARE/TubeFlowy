import { cls, css, div, fragment, svg, circle } from "./infra";
import { chevron } from "./infra/icons";

const outerRadius = 10;
const innerRadius = 5;
const myCircle = () =>
  svg(
    {
      className: cls.svgContainer,
      viewBox: `0 0 ${outerRadius * 2} ${outerRadius * 2}`,
      style: {
        width: outerRadius * 2,
        height: outerRadius * 2,
        fill: "#4C5155",
      },
    },
    circle({
      className: cls.outerCircle,
      cx: outerRadius,
      cy: outerRadius,
      r: outerRadius,
      fill: "#B8BCBF",
    }),
    circle({
      cx: outerRadius,
      cy: outerRadius,
      r: innerRadius,
      fill: "#4C5155",
    })
  );

const row = (title: string) =>
  div({ className: cls.row }, chevron(cls.chevron), myCircle() as any, title);

document.body.appendChild(fragment([row("Foo"), row("Bar")]));

css.class(cls.row, {
  margin: "0 auto",
  maxWidth: 700,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontWeight: 500,
  marginBottom: 12,
  color: "rgb(42, 49, 53)",
});

css.firstOfType(cls.row, {
  marginTop: 20,
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
});
