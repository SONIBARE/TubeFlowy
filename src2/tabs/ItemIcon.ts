import { cls, colors, spacings, style, svg } from "../infra";

export default class ItemIcon {
  svg: SVGElement;

  constructor(public item: Item) {
    this.svg = this.create();
  }

  create() {
    return svg.svg({
      className: cls.rowIcon,
      viewBox: "0 0 100 100",
      children: [
        this.createCircleAtCenter({
          className: cls.rowCircleEmpty,
          r: 19,
          strokeWidth: 2,
          stroke: colors.darkPrimary,
          fill: "white",
        }),
      ],
    });
  }

  createCircleAtCenter = (props: Omit<svg.CircleProps, "cx" | "cy">) =>
    svg.circle({
      cx: 100 / 2,
      cy: 100 / 2,
      ...props,
    });
}

style.class(cls.rowIcon, {
  marginRight: spacings.spaceBetweenCircleAndText,
  //   cursor: "pointer",
  width: spacings.outerRadius * 2,
  //   minWidth: spacings.outerRadius * 2,
  height: spacings.outerRadius * 2,
  //   backgroundSize: "cover",
  //   backgroundPosition: `50% 50%`,
  color: colors.darkPrimary,
});
