import { cls, colors, spacings, style, svg, ClassName } from "../infra";

export default class ItemIcon {
  svg: SVGElement;

  constructor(public item: Item) {
    this.svg = this.create();
  }

  create() {
    return svg.svg({
      className: cls.rowIcon,
      viewBox: "0 0 100 100",
      children: [this.createCircleAtCenter(cls.rowCircleEmpty, 19)],
    });
  }

  createCircleAtCenter = (className: ClassName, r: number) =>
    svg.circle({ cx: 100 / 2, cy: 100 / 2, className, r });
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

style.class(cls.rowCircleEmpty, {
  fill: "transparent",
  strokeWidth: 2,
  themes: {
    dark: { stroke: "white" },
    light: { stroke: colors.darkPrimary },
  },
});
