import { lightChevron } from "../src/infra/icons";
import { dom, style } from "./infra";
// import { viewCounter } from "./page";

//TASKS for SVG
//bind
//unsub on remove from dom
//if not possible to extend
const svgBox = () =>
  dom.svg({
    viewBox: "0 0 100 100",
    children: [
      dom.circle({
        cx: 50,
        cy: 50,
        r: 20,
        fill: "red",
        stroke: "black",
        strokeWidth: 5,
      }),
      dom.polygon({
        fill: "blue",
        points: "45,45 55,45, 55,55 45,55",
      }),
    ],
  });
document.body.appendChild(
  lightChevron({
    className: "path-svg" as any,
  })
);
document.body.appendChild(
  dom.svg({
    className: "path-svg" as any,
    viewBox: "0 0 5 8",
    fill: "none",
    children: [
      dom.path({
        className: "path2" as any,
        d: "M0 0 L4 4 L0 8",
        stroke: "currentColor",
        strokeLinecap: "round",
      }),
    ],
  })
);
document.body.appendChild(svgBox());

style.class("path-svg" as any, {
  width: 200,
});

style.class(
  "path2" as any,
  {
    stroke: "red",
  } as any
);
