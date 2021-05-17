import { svg } from "../browser";

export const chevron = (props: Partial<svg.SvgProps>): SVGSVGElement =>
  svg.svg({
    ...props,
    viewBox: "0 0 256 512",
    children: [
      svg.path({
        d:
          "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z",
        fill: "currentColor",
      }),
    ],
  });

export const home = (props: Partial<svg.SvgProps>): SVGSVGElement =>
  svg.svg({
    ...props,
    viewBox: "0 0 576 512",
    children: [
      svg.path({
        d:
          "M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z",
        fill: "currentColor",
      }),
    ],
  });

export const lightChevron = (props: Partial<svg.SvgProps>): SVGSVGElement =>
  svg.svg({
    ...props,
    viewBox: "0 0 5 8",
    fill: "none",
    children: [
      svg.path({
        d: "M0 0 L4 4 L0 8",
        stroke: "currentColor",
        strokeLinecap: "round",
      }),
    ],
  });

export const lightSearch = (props: Partial<svg.SvgProps>): SVGSVGElement =>
  svg.svg({
    ...props,
    viewBox: "0 0 512 512",
    fill: "none",
    children: [
      svg.path({
        d:
          "M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z",
        stroke: "currentColor",
      }),
    ],
  });
